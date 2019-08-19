Docker-native app:<br>
Mock-server for endpoints and WebSockets

It should be build with command<br>
cd $APP_DIR<br>
docker build . -t mock-serv

You can run it with<br>
docker run -p 8044:8044 -p 5080:5080 -v $HOME:/data mock-serv

And use localhost machine as server with port 8044 for REST requests<br>
And 5080 for WS connections

Endpoints on HTTP can be added to such file as:<br>
{
  "/login": {
    "200": {"a": "b"},
    "400": {"error": {"message": "Some message"}}
  }
}<br>
Where key is endpoint and response is value. It should be located in $HOME/endpoints.js<br>
F.e. http://localhost:8044/login?code=200 will return you {"a":"b"}
