function RenderForSIP(arg)
	render(arg.RenderObject)
	for i,v in pairs(arg.RenderObject) do
		print(i, v:GetType())
		if v:GetType() == 'CAMERA' then
			-- save render image as jpg on memory
			local saver = ImageSaver()
			local imageBuffer = saver:SaveMemory(1, v:GetImageBuffer())
			local imageBufferSize = saver:MemorySize()

			-- create metabinary
			local metabin = MetaBinary()
			local json = [[{
				 "jsonrpc" : "2.0",
				 "method" : "AddContent",
				 "to" : "master",
				 "params" : {
					 "type" : "image",
					 "posx" : "100",
					 "posy" : "100",
					 "width" : "512",
					 "height" : "512"
				 }
			}]]
			metabin:Create(json, imageBuffer, imageBufferSize) 

			print('Send:', arg.send);
			-- send through websockt
			local network = Connection()
			network:Connect(arg.send) --'ws://localhost:8082/v1/')
			network:SendBinary(metabin:BinaryBuffer(), metabin:BinaryBufferSize())
			network:Close()
			
		end
	end
end