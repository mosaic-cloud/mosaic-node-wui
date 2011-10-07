
    $(document).ready(function()
    {
        var fetch = false;
        var autoscroll = true;
        var load = undefined;
        
        var req = undefined;
        var time = undefined;
        
        
        function addLogLevelClass(row) {
            row.addClass("error");
            return row;
        }
        
        
        $("#autoscroll").click(function() {
            if(autoscroll == false) {
                $(this).removeClass("success");
                $(this).text("Autoscroll (On)");
                autoscroll = true;
            }
            else {
                $(this).addClass("success");
                $(this).text("Autoscroll (Off)");
                autoscroll = false;
            }
        });
        
        
        $("#clear").click(function() {
            $(".log").remove();
        });
        
        
        $("#fetch").click(function() {
            if(fetch == false) {
                $(this).removeClass("success");
                $(this).text("Fetch (On)");
                $("#clear").click();
                fetch = true;
                load = 0;
                reconnect(0);
            }
            else {
                $(this).addClass("success");
                $(this).text("Fetch (Off)");
                fetch = false;
                disconnect();
            }
        });
        
        
        function reconnect(delay) {
            disconnect();
            if(!fetch)
                return;
            time = setTimeout(function() {
                    disconnect();
                    req = new XMLHttpRequest ();
                    req.onreadystatechange = stateChangeHandler;
                    req.open("GET", "/log/stream", true);
                    req.send();
            }, delay);
        }
        
        
        function disconnect() {
            if (time)
                clearTimeout(time);
            if (req) {
                req.onreadystatechange = undefined;
                req.abort();
            }
            time = undefined;
            req = undefined;
        }
        
        
        function stateChangeHandler() {
            var log = $("#list");
            var buffer = "";
            
            if(req.status != 200) {
                reconnect(1000);
                return false;
            }
            if(req.readyState == 1) {
                load = 0;
                return;
            }
            if(req.readyState == 4) {
                reconnect(1000);
                return false;
            }
            
            if(req.responseText.length <= load)
                return;
            var lastLog = req.responseText.slice(load);
            lastLog = lastLog.replace(/\r/g, '');
            lastLog = lastLog.replace(/ /g, "&nbsp;");
            lastLog = lastLog.replace(/</g, "&lt;");
            lastLog = lastLog.replace(/>/g, "&gt;");
            load = req.responseText.length;
            
            buffer += lastLog;
            if(buffer.lastIndexOf("\n") >= 0) {
                var lines = buffer.split("\n");
                if (buffer[buffer.length - 1] == "\n") {
                    buffer = "";
                }
                else {
                    buffer = lines.pop();
                }
                $.each(lines, function(index, line) {
                    var row = $("<li class='log'><code>" + line + "</code></li>");
                    row = addLogLevelClass(row);
                    log.append(row);
                });
            }
            
            if(autoscroll) {
                var logs = document.getElementById("logs");
                logs.scrollTop = logs.scrollHeight;
            }
        }
        
        setTimeout(function() {
            $("#fetch").click();
        }, 500);
    });

