
    $(document).ready(function()
    {
        var load = 0;
        var autoscroll = true;
        
        function addLogLevelClass(row) {
            row.addClass("error");
            return row;
        }
        
        $("#autoscroll").click(function() {
            var state = $(this).is(':checked')
            
            if(state == true){
                autoscroll = true;
            }
            else {
                autoscroll = false;
            }
        });
        
        $("#clear_btn").click(function(){
            $(".log").remove();
        });
        
        $("#btn").click(function(){
            
            //var log = $("#logs");
            var log = $("#list");
            var req = new XMLHttpRequest();
            var buffer = "";
            
            function reconnect() {
                setTimeout(function(){
                        req.open("GET", "/log/stream", true);
                        req.send();
                        $("#list").append("<br /><hr /><br />");
                }, 2000);
            }
            
            req.onerror = reconnect;
            
            req.onabord = reconnect;
            
            req.onreadystatechange = function() {
                
                if(req.readyState == 4) {
                    reconnect();
                }
                
                var lastLog = req.responseText.slice(load).replace(/\r/g, '');
                
                if(lastLog.lastIndexOf("\n") == -1) {
                    buffer += lastLog;
                }
                
                else if(lastLog.lastIndexOf("\n") == lastLog.length - 1) {
                    lastLog = lastLog.split("\n");
                    $.each(lastLog, function(index, data) {
                        if(data != "" && data.length > 3) { // 3 is a magic number :|, the server is sending me the size of the chunked ...
                            $row = $("<li class='log'>" + data + "</li>");
                            $row = addLogLevelClass($row);
                            log.append($row);
                        }
                    });
                }
                
                else {
                    lastLog = lastLog.split("\n");
                    if(buffer.length > 0) {
                        buffer += lastLog.shift();
                        $row = addLogLevelClass($(buffer));
                        log.append($("<li class='log'>" + $row + "</li>"));
                        buffer = "";
                    }
                    buffer = lastLog.pop();
                    if(lastLog.length > 0) {
                        $.each(lastLog, function(index, data){
                            $row = $("<li class='log'>" + data + "</li>");
                            $row = addLogLevelClass($row);
                            log.append($row);
                        });
                    }
                }

                load = req.responseText.length;
                
                dh = document.body.scrollHeight;
                ch = document.body.clientHeight;
                
                if(autoscroll == true && dh > ch){
                    move = dh - ch;
                    window.scrollTo(0, move);
                }
            }
            req.open("GET", "/log/stream", true);
            req.send();
        });
    });

