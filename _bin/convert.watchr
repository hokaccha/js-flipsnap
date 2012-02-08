watch('.*') { |md|
    dir = md[0]

    if dir.match('^_less')
        system 'lessc _less/style.less css/style.css'
        puts 'less convert'
    end

    if !dir.match('^_site')
        system 'jekyll'
    end
}
