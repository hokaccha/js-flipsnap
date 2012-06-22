desc 'minify script'
task 'min' do
  require 'uglifier'
  dist = 'flipsnap.min.js'
  js = File.read('flipsnap.js')
  compiled = Uglifier.compile(js)
  open('flipsnap.min.js', 'w') {|f| f.write compiled}
  puts "create #{dist}"
end
