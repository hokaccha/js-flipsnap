describe('Flipsnap', function() {
  var $sandbox = $('<div>').attr('id', 'sandbox').hide().appendTo('body');

  afterEach(function() {
    $sandbox.empty();
  });

  describe('constructor', function() {
    context('when set dom element', function() {
      it('element should be set', function() {
        var div = document.createElement('div');
        var f = Flipsnap(div);
        expect(f.element).to.be(div);
      });
    });

    context('when set string(css seclector)', function() {
      context('when exist element', function() {
        it('element should be search by selector', function() {
          var $div1 = $('<div>').attr('id', 'div1').appendTo($sandbox);
          var $div2 = $('<div>').attr('id', 'div2').appendTo($sandbox);
          var f = Flipsnap('#sandbox div');
          expect(f.element).to.be($div1.get(0));
        });
      });

      context('when not exist element', function() {
        it('should throw error' ,function() {
          expect(function() {
            Flipsnap('#sandbox div');
          }).to.throwError(/element not found/);
        });
      });
    });
  });
});
