from http.server import HTTPServer, CGIHTTPRequestHandler
import json
import io

class httpProcessor(CGIHTTPRequestHandler):
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length).decode().split("&")
        
        if len(post_data) == 2:
            with io.open('data.json', encoding = "utf_8") as f:
                data = json.load(f) 
            print(post_data)
            data[post_data[0]]["column"] = post_data[1]
            
            with io.open('data.json', "w", encoding = "utf_8") as f:
                json.dump(data, f, sort_keys=True, indent=4, ensure_ascii=False)
        
            
        if len(post_data) == 3:
            d = {}
            d["column"] = "left"
            d["author"] = post_data[0]
            d["name"] = post_data[1]
            d["img"] = post_data[2]
            
            with io.open('data.json', encoding = "utf_8") as f:
                data = json.load(f)
            dataLen = len(data)

            data[str(dataLen+1)] = d
            with io.open('data.json', "w", encoding = "utf_8") as f:
                json.dump(data, f, sort_keys=True, indent=4, ensure_ascii=False)
                
server_address = ("", 8000)
httpd = HTTPServer(server_address, httpProcessor)
httpd.serve_forever()
