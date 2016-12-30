/**
 * Created by dw on 2016/9/20.
 */
var Drawing = function (opts) {
    this.defaults = {lineWidth: 1, strokeStyle: 'red'};
    this.opts = this.extend(this.defaults, opts);
    this.canvas = document.getElementById(opts.id);
    this.context = this.canvas.getContext("2d");
    this.init();
    this.bindEvent();
};

Drawing.prototype.init = function () {
    if (this.opts.src) {
        this.loadImage(this.opts.src);
    }
    if (this.opts.fullScreen) {
        this.resizeCanvas();
    }
    this.context.lineWidth = this.opts.lineWidth;
    this.context.strokeStyle = this.opts.strokeStyle;
};

Drawing.prototype.resizeCanvas = function () {
    if (this.canvas.width < window.innerWidth) {
        this.canvas.width = window.innerWidth;
    }
    if (this.canvas.height < window.innerHeight) {
        this.canvas.height = window.innerHeight;
    }
};

Drawing.prototype.loadImage = function (src) {
    var self = this,
        img = new Image();
    img.src = src;
    img.onload = function () {
        self.context.drawImage(img, 0, 0);
    };
};

Drawing.prototype.getImage = function () {
    return this.canvas.toDataURL("image/jpeg", 0.6);
};

Drawing.prototype.bindEvent = function () {
    var pp = false, canvas = this.canvas, context = this.context;

    canvas.onmousedown = canvas.ontouchstart = function (e) {
        e.preventDefault();
        pp = true;

        var mousePos = getMousePos.call(this, e);
        context.moveTo(mousePos.x, mousePos.y); //起始位置
    };

    canvas.onmouseup = canvas.ontouchend = function (e) {
        e.preventDefault();
        pp = false;
    };

    canvas.onmousemove = canvas.ontouchmove = function (e) {
        e.preventDefault();
        var mousePos = getMousePos.call(this, e);
        if (pp) {
            context.lineTo(mousePos.x, mousePos.y); //终止位置
            context.stroke(); //结束图形
        }
    };

    function getMousePos(e) {
        var touch = e;
        if (touch.targetTouches && touch.targetTouches.length > 0) {
            touch = touch.targetTouches[0];
        }
        return {
            x: touch.pageX - this.offsetLeft,
            y: touch.pageY - this.offsetTop
        };
    }
};

Drawing.prototype.extend = function (target, options) {
    for (var name in options) {
        target[name] = options[name];
    }
    return target;
};

