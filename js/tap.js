( function ( $ )
{
    //使用tap代替click
    var moved = 0;
    var taps = function ( e )
    {
        e.stopPropagation();
        switch ( e.type )
        {
            case 'touchstart':
                moved = 0;
                break;
            case 'touchmove':
                moved = 1;
                break;
            case 'touchend':
                if ( !moved )
                {
                    $( e.target ).trigger( 'tap' );
                }
                break;
            default: break;
        }
    };
    $.event.special.tap = {
        setup: function ()
        {
            $.event.add( this, 'touchstart touchmove touchend', taps );
        },
        teardown: function ()
        {
            $.event.remove( this, 'touchstart touchmove touchend', taps );
        }
    };
} )( jQuery );

( function ( $ )
{
    //上下左右
    var posY = 0, posX = 0, lastTime = 0;
    var swipes = function ( e )
    {
        e.preventDefault();
        e.stopPropagation();
        switch ( e.type )
        {
            case 'touchstart':
                lastTime = ( new Date() ).getTime();
                posY = e.originalEvent.targetTouches[0].pageY;
                posX = e.originalEvent.targetTouches[0].pageX;
                break;
            case 'touchend':
                var dy = e.originalEvent.changedTouches[0].pageY - posY,
                      dx = e.originalEvent.changedTouches[0].pageX - posX;
                var orientation = '';
                if ( ( ( new Date() ).getTime() - lastTime ) < 1000 )
                {
                    if ( Math.abs( dy ) > 40 )
                    {
                        orientation = ( dy > 0 ) ? 'down' : 'up';
                        $( e.target ).trigger( 'swipe', orientation );
                    }
                    else if ( Math.abs( dx ) > 40 )
                    {
                        if ( dx > 0 )
                        {
                            orientation = 'right';
                        }
                        else
                        {
                            orientation = 'left';
                        }
                        $( e.target ).trigger( 'swipe', orientation );
                    }
                }
                break;
        }
    };
    $.event.special.swipe = {
        setup: function ()
        {
            $.event.add( this, 'touchstart touchend', swipes );
        },
        teardown: function ()
        {
            $.event.remove( this, 'touchstart touchend', swipes );
        }
    };
} )( jQuery );
