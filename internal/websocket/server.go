package websocket

import (
	"fmt"
	"sync"

	"github.com/gofiber/fiber/v2"
	fiberws "github.com/gofiber/websocket/v2"
	"github.com/khanghh/mcmanager/internal/gen"
	"google.golang.org/protobuf/proto"
)

type HandleFunc func(cl *Client, msg *gen.Message) error

type Server struct {
	clients      map[*Client]struct{}
	topics       map[string]*Topic
	handlers     map[gen.MessageType]HandleFunc
	broadcast    chan *gen.Message
	register     chan *Client
	unregister   chan *Client
	mu           sync.Mutex
	onConnect    func(cl *Client) error
	onDisconnect func(cl *Client) error
	shutdown     chan struct{}
}

func (s *Server) getTopic(name string) *Topic {
	s.mu.Lock()
	defer s.mu.Unlock()

	topic, ok := s.topics[name]
	if !ok {
		topic = &Topic{
			name: name,
			subs: make(map[*Client]struct{}),
		}
		s.topics[name] = topic
	}
	return topic
}

func (s *Server) FindTopic(name string) *Topic {
	s.mu.Lock()
	defer s.mu.Unlock()

	topic, ok := s.topics[name]
	if !ok {
		return nil
	}
	return topic
}

func (s *Server) OnConnect(onConnect func(cl *Client) error) {
	s.onConnect = onConnect
}

func (s *Server) OnDisconnect(onDisconnect func(cl *Client) error) {
	s.onDisconnect = onDisconnect
}

func (s *Server) RegisterHandler(msgType gen.MessageType, handler HandleFunc) {
	s.handlers[msgType] = handler
}

func (s *Server) StartBroadcast(topicName string, producer func() *gen.Message) {

}

func (s *Server) Broadcast(msg *gen.Message) {
	select {
	case <-s.shutdown:
		return
	default:
	}
	s.broadcast <- msg
}

func (s *Server) BroadcastTopic(topic string, msg *gen.Message) {
	select {
	case <-s.shutdown:
		return
	default:
	}
	s.getTopic(topic).Broadcast(msg)
}

func (s *Server) ServeFiberWS() fiber.Handler {
	return fiberws.New(func(conn *fiberws.Conn) {
		cl := &Client{
			conn:   conn,
			out:    make(chan []byte, 128),
			server: s,
			closed: make(chan struct{}),
		}
		s.register <- cl
		go cl.readPump()
		cl.writePump()
		s.unregister <- cl
		fmt.Println("client disconnected")
	})
}

func (s *Server) handleMessage(cl *Client, msg *gen.Message) error {
	switch payload := msg.Payload.(type) {
	case *gen.Message_Subscribe:
		return cl.Subscribe(payload.Subscribe.Topic)
	case *gen.Message_Unsubscribe:
		return cl.Unsubscribe(payload.Unsubscribe.Topic)
	}
	handler, ok := s.handlers[msg.Type]
	if !ok {
		return nil
	}
	return handler(cl, msg)
}

func (s *Server) loop() {
	defer func() {
		for cl := range s.clients {
			if s.onDisconnect != nil {
				if err := s.onDisconnect(cl); err != nil {
					fmt.Println("disconnect error:", err)
				}
			}
			cl.Close()
			delete(s.clients, cl)
		}
	}()

	for {
		select {
		case <-s.shutdown:
			return
		case msg := <-s.broadcast:
			data, err := proto.Marshal(msg)
			if err != nil {
				fmt.Println("proto marshal:", err)
				continue
			}
			for c := range s.clients {
				if err := c.send(data); err != nil {
					fmt.Println("send:", err)
				}
			}
		case cl := <-s.register:
			if s.onConnect != nil {
				if err := s.onConnect(cl); err != nil {
					fmt.Println("client rejected:", err)
					cl.Close()
					continue
				}
			}
			s.clients[cl] = struct{}{}
		case cl := <-s.unregister:
			if s.onDisconnect != nil {
				if err := s.onDisconnect(cl); err != nil {
					fmt.Println("disconnect error:", err)
				}
			}
			cl.Close()
			delete(s.clients, cl)
		}
	}
}

func (s *Server) Shutdown() error {
	select {
	case <-s.shutdown:
	default:
		close(s.shutdown)
	}
	return nil
}

func (s *Server) Done() <-chan struct{} {
	return s.shutdown
}

func NewServer() *Server {
	s := &Server{
		clients:    map[*Client]struct{}{},
		register:   make(chan *Client),
		unregister: make(chan *Client),
		broadcast:  make(chan *gen.Message),
		shutdown:   make(chan struct{}),
	}

	go s.loop()
	return s
}
