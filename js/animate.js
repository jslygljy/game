( function ( $ )
{
    //����animate.css���÷���
    $.fn.runAnimation = function ( name, duration, callback )
    {
        var that = this, timer = null;
        that.addClass( "animated " + name );
        timer = setTimeout( function ()
        {
            that.removeClass( name );
            clearTimeout( timer );
            timer = null;
            if ( callback )
            {
                that.hide();
                setTimeout( function ()
                {
                    that.show();
                    callback();
                }, 5 );
            }
        }, duration );
    };

} )( jQuery );