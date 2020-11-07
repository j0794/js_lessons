class Slider {
    constructor(selector) {
        this.parent = document.querySelector(selector);
        this.startItems = null;
        this.track = null;
        this.slidesCount = 0;
        this.offset = 0;
        this.sliderWidth = 0;
        this.trackWidth = 0;
        this.startOffset = 0;
        this.activeSlide = 1;
        this.inited = false;
        this.calculateSliderSizesTimeout = null;
    };

    init() {
        let track = document.createElement('div'),
            navs = document.createElement('div'),
            navPrev = document.createElement('div'),
            navNext = document.createElement('div'),
            cloneItemsAfter = [],
            cloneItemsBefore = [];

        this.sliderWidth = this.parent.clientWidth;
        track.classList.add('slider-track');
        navs.classList.add('slider-navs');
        navPrev.classList.add('slider-prev');
        navNext.classList.add('slider-next');

        navPrev.textContent = '<';
        navNext.textContent = '>';

        navs.append(navPrev, navNext);

        this.startItems = [].slice.call(this.parent.children);
        this.slidesCount = this.startItems.length;
        for (let startItem of this.startItems) {
            let sliderItem = document.createElement('div'),
                cloneAfter,
                cloneBefore;

            sliderItem.classList.add('slider-item');
            sliderItem.append(startItem);

            cloneAfter = sliderItem.cloneNode(true);
            cloneAfter.classList.add('slider-item-clone');
            cloneBefore = cloneAfter.cloneNode(true);

            track.append(sliderItem);
            cloneItemsAfter.push(cloneAfter);
            cloneItemsBefore.push(cloneBefore);
        };

        track.prepend(...cloneItemsAfter);
        track.append(...cloneItemsBefore);

        this.track = track;
        this.parent.innerHTML = '';
        this.parent.append(this.track, navs);

        this.calculateSliderSizes();

        window.addEventListener('resize', () => {
            clearTimeout(this.calculateSliderSizesTimeout);
            this.calculateSliderSizesTimeout = setTimeout(() => {
                this.calculateSliderSizes();
            }, 250);
        });

        navPrev.addEventListener('click', () => {
            this.move(-1);
        });

        navNext.addEventListener('click', () => {
            this.move(1);
        });

        track.addEventListener('transitionend', () => {
            if (this.offset > (-1 * this.trackWidth / 3)) {
                this.offset = this.offset - this.trackWidth / 3;
            } else if (this.offset < (-2 * this.trackWidth / 3 + this.sliderWidth)) {
                this.offset = this.offset + this.trackWidth / 3;
            };
            this.track.style.transition = "none";
            this.track.style.transform = 'translateX(' + this.offset + 'px)';
        });

        track.onpointerdown = (e) => {
            track.style.transition = "none";

            let pageXStart = e.pageX,
                shiftX = e.pageX - this.offset;

            document.onpointermove = (e) => {
                this.moveByPointer(e, shiftX);
            };

            track.onpointerup = (e) => {

                document.onpointermove = null;
                if (e.pageX - pageXStart >= 10) {
                    this.move(-1);
                } else if (e.pageX - pageXStart <= -10) {
                    this.move(1);
                } else if ((0 < e.pageX - pageXStart < 10) || (-10 < e.pageX - pageXStart < 0)) {
                    track.style.transition = '';
                    track.style.transform = 'translateX(' + this.offset + 'px)';
                };
                track.onpointerup = null;
            };

            document.onpointerup = (e) => {
                document.onpointermove = null;
                track.onpointerup = null;
            };

        };

        track.ondragstart = () => {
            return false;
        };

        this.inited = true;
    };

    move(value) {
        let possibleOffset = this.offset - this.sliderWidth * value,
            possibleSlide = this.activeSlide + value;

        if (possibleOffset <= (-1 * this.trackWidth) || possibleOffset > 0) {
            return;
        };
        this.track.style.transition = "";
        if (possibleSlide > this.slidesCount) {
            this.activeSlide = possibleSlide - this.slidesCount;
        } else if (possibleSlide < 1) {
            this.activeSlide = this.slidesCount - possibleSlide;
        } else {
            this.activeSlide = possibleSlide;
        }
        this.offset = possibleOffset;
        this.track.style.transform = 'translateX(' + this.offset + 'px)';
    };

    moveByPointer(e, shiftX) {
        this.track.style.transform = 'translateX(' + (e.pageX - shiftX) + 'px)';
    }

    calculateSliderSizes() {
        this.sliderWidth = this.parent.clientWidth;
        for (let sliderItem of this.track.children) {
            sliderItem.style.width = this.sliderWidth + 'px';
        }
        this.trackWidth = 3 * this.slidesCount * this.sliderWidth;
        this.startOffset = -1 * this.trackWidth / 3;
        if (this.inited) {
            this.offset = this.startOffset - (this.activeSlide - 1) * this.sliderWidth;
        } else {
            this.offset = this.startOffset;
        }
        this.track.style.transition = "none";
        this.track.style.transform = 'translateX(' + this.offset + 'px)';
    };

    destroy() {
        this.parent.innerHTML = '';
        this.parent.append(...this.startItems);
        this.startItems = null;
        this.track = null;
        this.inited = false;
    };
};

class Tabs {
    constructor(selector) {
        this.parent = document.querySelector(selector);
    }

    init() {
        let shortcuts = this.parent.querySelector('.tab-shortcuts'),
            tabs = this.parent.querySelector('.tabs'),
            shortcutsArray = [].slice.call(shortcuts.children),
            tabsArray = [].slice.call(tabs.children);

        shortcutsArray.forEach( (shortcut, index) => {
            shortcut.addEventListener('click', () => {
                let activeShortcut = shortcuts.querySelector('.active'),
                    activeTab = tabs.querySelector('.active');
                activeShortcut.classList.remove('active');
                activeTab.classList.remove('active');
                shortcut.classList.add('active');
                tabsArray[index].classList.add('active');
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    let mySlider = new Slider('.slider');
    mySlider.init();

    let myTabs = new Tabs('.tabs-wrapper');
    myTabs.init();
});