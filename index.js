let element = document.getElementById('data-simple-slide')

function SlideShow(element, images, delay){
    this.element = element;
    this.delay = delay;
    this.playing = false;
    this.numberOfSlides = this._populate(images);
    this.initialState = [this.numberOfSlides-1, 0];
    this.currentState = Array.from(this.initialState);
    this.next();

    this.slideChangeCallbacks = [];
}

SlideShow.prototype._populate = function(images){
    if(images === true)
        images = JSON.parse(element.getAttribute('data-simple-slide-imgs'));
    else if(images === false){
        images = element.querySelectorAll("li");
        this.slides = images;
        return images.length;
    }
        
    this.slides = [];
    images.forEach((img)=>{
        let slide = document.createElement('li');
        slide.style.backgroundImage = 'url('+img+')';
        this.element.appendChild(slide);
        this.slides.push(slide);
    });
    
    return images.length;
}

SlideShow.prototype.next = function(){
    if(this.numberOfSlides === 0)
        return;
    this.slides[this.currentState[0]].classList.remove('active');
    this.slides[this.currentState[1]].classList.add('active');
    if(this.currentState[1] === this.numberOfSlides - 1)
        this.currentState = Array.from(this.initialState);
    else{
        this.currentState[0] = this.currentState[1]
        this.currentState[1] += 1;
    }
}

SlideShow.prototype.play = function(){
    this.playing = setInterval(()=>{
        this.next();
        this.slideChangeCallbacks.forEach((cb)=>{
            cb(this.currentState[0]);
        });
    }, this.delay);
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
    if(this.playing === false)
        return;
    clearInterval(this.playing);
    this.playing = false;
}

SlideShow.prototype.onSlideChange = function(cb){
    this.slideChangeCallbacks.push(cb.bind(this));
}

SlideShow.prototype.isPlaying = function(){
    return this.playing !== false;
}

let slideShow = new SlideShow(element, false, 2000);

slideShow.onSlideChange((currentSlide)=>{
    console.log(currentSlide);
});