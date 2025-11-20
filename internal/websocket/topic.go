package websocket

import (
	"sync"

	"github.com/khanghh/mcmanager/internal/gen"
)

type Topic struct {
	name   string
	subs   map[*Client]struct{}
	mu     sync.RWMutex
	closed bool
}

func (t *Topic) AddSubscriber(cl *Client) {
	t.mu.Lock()
	defer t.mu.Unlock()

	if t.closed {
		return // ignore if closed
	}
	t.subs[cl] = struct{}{}
}

func (t *Topic) RemoveSubscriber(cl *Client) {
	t.mu.Lock()
	defer t.mu.Unlock()

	if len(t.subs) == 0 {
		return
	}

	delete(t.subs, cl)
}

func (t *Topic) Broadcast(msg *gen.Message) {
	t.mu.RLock()
	if t.closed {
		t.mu.RUnlock()
		return
	}

	// copy subscribers under read-lock
	subs := make([]*Client, 0, len(t.subs))
	for cl := range t.subs {
		subs = append(subs, cl)
	}
	t.mu.RUnlock()

	// send outside lock so slow clients don’t block topic
	for _, cl := range subs {
		cl.SendMessage(msg)
	}
}

func (t *Topic) Close() {
	t.mu.Lock()
	if t.closed {
		t.mu.Unlock()
		return
	}
	t.closed = true

	// drop all subscribers
	for cl := range t.subs {
		delete(t.subs, cl)
	}
	t.mu.Unlock()
}
