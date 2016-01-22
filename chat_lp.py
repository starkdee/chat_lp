import tornado.web
import tornado.httpserver
import tornado.ioloop
import tornado.options
from uuid import uuid4

from tornado.options import define, options
define('port', default=8000, help='run on the given port', type=int)

class Application(tornado.web.Application):
    def __init__(self):
        self.chat = Chat()

        handlers = [
            (r'/', IndexHandler),
            (r'/message', MessageHandler),
            (r'/message/update', StatusHandler)
        ]

        settings = {
            'template_path': 'templates',
            'static_path': 'static',
            'debug': True
        }
        tornado.web.Application.__init__(self, handlers, **settings)


class Chat(object):
    def __init__(self):
        self.message = {}
        self.callbacks = []

    def register(self, callback):
        self.callbacks.append(callback)

    def send_message(self, text, session):
        self.message['text'] = text
        self.message['session'] = session
        self.notify()
        print self.message
        self.message = {}

    def notify(self):
        for callback in self.callbacks:
            callback(self.message)
        self.callbacks = []


class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        session = uuid4()
        self.render('index.html', session=session)


class MessageHandler(tornado.web.RequestHandler):
    def post(self):
        text = self.get_argument('text')
        session = self.get_argument('session')
        print text, session

        if not text or not session:
            self.set_status(400)

        self.application.chat.send_message(text, session)


class StatusHandler(tornado.web.RequestHandler):
    @tornado.web.asynchronous
    def get(self):
        self.application.chat.register(self.on_message)

    def on_message(self, message):
        message = '{"text": "%s", "session": "%s"}' % (message['text'],
            message['session'])
        self.write(message)
        self.finish()


if __name__ == '__main__':
    tornado.options.parse_command_line()
    http_server = tornado.httpserver.HTTPServer(Application())
    http_server.listen(options.port)
    tornado.ioloop.IOLoop.instance().start()
