$(window).on('load', function () {
    
    //参数数组
    var Constant = {
        winWidth: $(window).width(),
        imgWidth: $(window).width() * 0.35,
        canSwipe: 1
    };


    $(document).on('touchstart', function (e) {
        e.preventDefault();
        return false;
    });


    $('.wrap').on('touchstart', function (e) {
        if ($('#player').attr('data-state') == 'stop') {
            $('#player').attr('data-state', 'playing');
            $('#player')[0].play();
        }
    });

    //控制字体大小

    $('#timeWrap,#score').css('font-size', $(window).width() * 0.07 + 'px');

    //牛奶控制器
    var Milk = {
        state: [1, 2, 3, 4, 5, 6],
        render: function () {
            var state = this.state;
            var milk = $('#bottomBar > .milk');
            milk.eq(state[0] - 1).attr('data-state', 'left');
            milk.eq(state[1] - 1).attr('data-state', 'center');
            milk.eq(state[2] - 1).attr('data-state', 'right');
            milk.eq(state[3] - 1).attr('data-state', 'backleft');
            milk.eq(state[4] - 1).attr('data-state', 'backcenter');
            milk.eq(state[5] - 1).attr('data-state', 'backright');
        },
        toLeft: function () {
            this.state.push(this.state.shift());
            this.render();
        },
        toRight: function () {
            this.state.unshift(this.state.pop());
            this.render();
        },
        toBox: function () {
            //执行送的动画
            var that = this;
            $('#bottomBar > .milk').eq(that.state[1] - 1).runAnimation('push', 500, function () {
                if (Box.canGet) {
                    //执行后续操作
                    var type = Box.getTarget.attr('data-type');
                    if (that.state[1] == type) {
                        Box.getTarget.children('.innerImage').runAnimation('bounceIn', 600);
                        Constant.canSwipe = 1;
                        Score.add(100);
                        Timer.add(2);
                        Box.addSpeed();
                    }
                    else {
                        //游戏结束
                        Timer.ended = true;
                        Constant.canSwipe = 0;
                        $('#player')[0].pause();
                        alert('游戏结束');
                    }
                }
                else {
                    //游戏结束
                    Timer.ended = true;
                    Constant.canSwipe = 0;
                    $('#player')[0].pause();
                    alert('游戏结束');
                }
            });
        }
    };

    //时间控制器

    var Timer = {
        ended: false,
        start: 0,
        update: function (callback) {
            var that = this;
            if (that.ended) {
                return;
            }
            var tmp = Math.floor(((new Date()).getTime() - that.start) / 1000);
            var second = Math.floor(tmp / 6) + 2;
            var mSecond = tmp % 6;
            var timer = null;
            if (tmp >= 30) {
                $('#timeWrap .second').text("07");
                $('#timeWrap .mSecond').text("00");
                that.ended = true;
                callback();
                return;
            }
            if (tmp > 20) {
                $('#timeWrap').css('color', 'red');
            }
            $('#timeWrap .second').text('0' + second);
            $('#timeWrap .mSecond').text(mSecond + '0');
            timer = setTimeout(function () {
                that.update(callback);
            }, 300);
        },
        run: function (callback) {
            this.start = (new Date()).getTime();
            this.update(callback);
        },
        add: function (num) {
            this.start += num * 1000;
        }
    };

    //分数

    var Score = {
        total: 0,
        add: function (score) {
            this.total += score;
            this.render(score);
        },
        render: function (score) {
            $('#score').show().text('+' + score).runAnimation('fadeOutUp', 1500, function () {
                $('#score').hide();
            });
        }
    };

    //盒子容器

    var Box = {
        canGet: false,
        getTarget: null,
        queue: [],
        qX: [],
        speed: 1.4,
        update: function () {
            if (Timer.ended) {
                return;
            }
            var that = this;
            that.canGet = false;
            that.getTarget = null;
            //第一个元素已经不在屏幕内
            if (that.qX[0] - Constant.imgWidth >= Constant.winWidth) {
                that.kick();
            }
            //可以生成下一个元素
            if (that.qX[that.qX.length - 1] - Constant.imgWidth >= Constant.winWidth * 0.2) {
                that.add();
            }
            for (var i in that.queue) {
                //判断是否可以触发投奶效果
                if (that.qX[i] <= 0.85 * Constant.winWidth && that.qX[i] >= 0.55 * Constant.winWidth) {
                    that.canGet = true;
                    that.getTarget = that.queue[i];
                }
                that.qX[i] += that.speed;
                that.queue[i].css('-webkit-transform', 'translateX(-' + that.qX[i] + 'px)');
            }
            setTimeout(function () {
                that.update();
            }, 17);
        },
        add: function () {
            var rand = Math.floor(Math.random() * 3 + 1);
            this.queue.push($('<div class="box" data-type=' + rand + '><img src="images/box' + rand + '.png" class="innerImage"></div>').appendTo('#boxWrap'));
            this.qX.push(0);
        },
        kick: function () {
            this.queue.shift().remove();
            this.qX.shift();
        },
        run: function () {
            this.add();
            this.update();
        },
        addSpeed: function () {
            if (this.speed >= 5) {
                return;
            }
            this.speed += 0.2
        }
    };

    Timer.run(function () {
        Constant.canSwipe = 0;
        $('#player')[0].pause();
        alert('游戏结束');
    });

    Box.run();

    $('.wrap').on('swipe', function (e, orientation) {
        e.stopPropagation();
        e.preventDefault();
        if (!Constant.canSwipe) {
            return;
        }
        switch (orientation) {
            case 'left':
                Milk.toLeft();
                break;
            case 'right':
                Milk.toRight();
                break;
            case 'up':
                Constant.canSwipe = 0;
                Milk.toBox();
                break;
        }
    });

});