let element = document.getElementById('data-simple-slide')

function SlideShow(element, images, delay){
    this.element = element;
    this.delay = delay;
    this.playing = false;
    this.numberOfSlides = this._populate(images);
    this.currentState = [0, 1];

    this.slideChangeCallbacks = [];
}

SlideShow.prototype._populate = function(images){
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

    for(let i = 0; i < this.slides.length; i++){
        if(i == 0)
            this.slides[0].classList.add('active');
        if(images !== false)
            this.element.appendChild(this.slides[i]);
    }
    
    this.element.classList.add("transition");
    return this.slides.length;
}

SlideShow.prototype.next = function(){
    if(this.numberOfSlides === 0)
        return;
    this.slides[this.currentState[0]].classList.remove('active');
    this.slides[this.currentState[1]].classList.add('active');
    this._continue();
}

SlideShow.prototype._continue = function(){
    for(let i = 0; i < this.numberOfSlides; i++){
        if(this.currentState[i] === this.numberOfSlides-1)
            this.currentState[i] = 0;
        else
            this.currentState[i] += 1;
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

let slideShow = new SlideShow(element, true, 1000);
slideShow.play();

slideShow.onSlideChange((currentSlide)=>{
    console.log(currentSlide);
});