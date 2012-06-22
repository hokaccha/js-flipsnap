desc 'build scss and jekyll'
task 'build' do
  sh 'sass _scss/style.scss > css/style.css'
  sh 'jekyll'
end

desc 'watch file and start server'
task 'watch' do
  fork { sh 'sass --watch _scss:css' }
  fork { sh 'jekyll --auto --server' }

  Process.waitall
end
