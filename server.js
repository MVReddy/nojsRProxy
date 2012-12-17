var net = require('net')

var hosts = [];

for(var _i=2; _i < process.argv.length; _i++){
    var tmp = String(process.argv[_i]);
    if (tmp.indexOf(':') != -1)
        var d = tmp.split(':');
    else
        var d = [tmp, '80'];

    console.log(d);

    hosts.push({host : d[0], port : d[1]});
}

var _state = 0;
var get_next_host = function (){
    var host = hosts[_state];
    _state ++;
    if (_state > hosts.length)
        _state = 0;
    return host;
}

var s = new net.Socket();
s.setEncoding('utf8');
s.on('error', function(err){
         console.log("Error connecting");
});

net.createServer(function(socket){
    socket.setEncoding('utf8');
    socket.on('error', function(err){
            console.log(err);
            socket.end();
    });
    socket.on('data', function(data){
        var h = get_next_host();
        console.log(h);
        s.connect(h.port, h.host);
        s.write(data);
        s.on('data',function(d){
            socket.write(d, "utf8");
        });
    });
}).listen(8080);

