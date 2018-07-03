let element = document.getElementById('data-simple-slide');

let unactiveStyle = {
    zIndex: 0,
    opacity: 0,
}

let activeStyle = {
    zIndex: 1,
    opacity: 1,
}

function SlideShow(element, images, transition, delay){
    this.transition = transition;
    this.delay = delay;

    this.element = element;
    this.playing = false;
    this.numberOfSlides = this._populate(images, {transition:`opacity ${transition}ms ease-in-out`});
    this.currentState = [-1, 0, 1];
    this._continue();
    this.slideChangeCallbacks = [];
}

SlideShow.prototype._populate = function(images, initialStyle){
    let slides;

    if(images === true)
        slides = JSON.parse(element.getAttribute('data-simple-slide-imgs'));
    else if(images === false){
        slides = element.querySelectorAll("li");
    }else{
        slides = images;
    }

    let buffer;
    this.slides = slides.map((slide)=>{
        if(images === true || images !== false){
            buffer = document.createElement('li');
            buffer.style.backgroundImage = 'url('+slide+')';
        }
        return buffer;
    });

    let initialActiveStyle = Object.assign({}, activeStyle, initialStyle);
    let initialUnactiveStyle = Object.assign({}, unactiveStyle, initialStyle);

    for(let i = 0; i < this.slides.length; i++){
        this._mergeSlideStyle(i, i === 0 ? initialActiveStyle:initialUnactiveStyle);
        if(images !== false)
            this.element.appendChild(this.slides[i]);
    }

    return this.slides.length;
}

SlideShow.prototype.next = function(){
    if(this.numberOfSlides === 0)
        return;
    this._mergeSlideStyle(this.currentState[0], unactiveStyle);
    this._mergeSlideStyle(this.currentState[1], activeStyle);
}

SlideShow.prototype._mergeSlideStyle = function(slideIndex, style){
    Object.assign(this.slides[slideIndex].style, style);
}

SlideShow.prototype._continue = function(){
    for(let i = 0; i < this.numberOfSlides; i++){
        if(this.currentState[i] >= this.numberOfSlides-1)
            this.currentState[i] = 0;
        else
            this.currentState[i] += 1;
    }
}

SlideShow.prototype.play = function(){
    if(this.isPlaying())
        return;
    this.playing = setInterval(()=>{
        this.next();
        this._continue();
        this.slideChangeCallbacks.forEach((cb)=>{
            cb(this.currentState[0]);
        });
    }, this.delay + this.transition/2);
}

SlideShow.prototype.setTransitionDelay = function(transition, immediately = true){
    this.transition = transition;
    for(let i = 0; i < this.numberOfSlides; i++){
        this._mergeSlideStyle(i, {transition: `opacity ${transition}ms ease-in-out`});
    }
    if(immediately){
        this.refresh();
    }
}

SlideShow.prototype.setDelay = function(delay, immediately = true){
    this.delay = delay;
    if(immediately){
        this.refresh();
    }
}

SlideShow.prototype.refresh = function(){
    if(this.playing !== false){
        clearInterval(this.playing);
        this.play();
    }
}

SlideShow.prototype.stop = function(){
    if(!this.isPlaying())
        return;
    this.refresh();
    clearInterval(this.playing);
    this.playing = false;
}

SlideShow.prototype.onSlideChange = function(cb){
    this.slideChangeCallbacks.push(cb.bind(this));
}

SlideShow.prototype.isPlaying = function(){
    return this.playing !== false;
}

let slideShow = new SlideShow(element, true, 1000, 1000);
slideShow.play();

slideShow.onSlideChange((currentSlide)=>{
    console.log(currentSlide);
});

var slider = document.getElementById("myRange");

slider.onchange = function() {
    slideShow.setTransitionDelay(this.value);
}