class Menu {
    constructor(selector) {
        this.menuWrapper = document.querySelector(selector);
        this.menu = this.menuWrapper.querySelector('.menu');
        this.menuItems = this.menu.children;
        this.fullMenuItems = this.menu.getElementsByTagName('li');
        this.startItems = null;
        this.menuWidth = 0;
        this.moreElement = null;
        this.moreList = null;
        this.resizeTimeout = null;
    }

    init() {
        this.startItems = [].slice.call(this.menu.children);
        this.menuWrapper.classList.add('not-ready');
        this.menuWidth = this.menuWrapper.clientWidth;
        this.menu.classList.add('nowrap');

        if (this.menuIsOverflowed()) {
            this.createMoreElement();

            window.addEventListener('resize', () => {
                clearTimeout(this.resizeTimeout);
                this.resizeTimeout = setTimeout(() => {
                    this.resize();
                }, 250);
            })

            let fullMenuItemsArray = [].slice.call(this.fullMenuItems);

            fullMenuItemsArray.forEach((fullMenuItem) => {
                let submenu = fullMenuItem.querySelector('.submenu');

                if (submenu) {
                    let submenuTimeout;

                    fullMenuItem.querySelector('a').addEventListener('click', (e) => {
                        if (!fullMenuItem.classList.contains('active')) {
                            e.preventDefault();
                            this.submenuOpen(fullMenuItem);
                        } else if (fullMenuItem === this.moreElement) {
                            e.preventDefault();
                            this.submenuClose(fullMenuItem);
                        }
                    });
                    fullMenuItem.addEventListener('pointerenter', (e) => {
                        if (e.pointerType === 'touch') {
                            return;
                        }

                        clearTimeout(submenuTimeout);
                        this.submenuOpen(fullMenuItem);
                    })
                    fullMenuItem.addEventListener('pointerleave', (e) => {
                        if (e.pointerType === 'touch') {
                            return;
                        }

                        submenuTimeout = setTimeout(() => {
                            this.submenuClose(fullMenuItem);
                        }, 750);
                    })
                }
            })

            document.addEventListener('click', (e) => {
                for (let fullMenuItem of this.fullMenuItems) {
                    let submenu = fullMenuItem.querySelector('.submenu');

                    if (submenu && !fullMenuItem.contains(e.target) && fullMenuItem.classList.contains('active')) {
                        this.submenuClose(fullMenuItem);
                    }
                }
            });
        }

        this.menuWrapper.classList.remove('not-ready');
    }

    menuIsOverflowed() {
        if (this.menu.scrollWidth > this.menuWidth) {
            return true;
        }
        return false;
    }

    createMoreElement() {
        let moreElement = this.moreElement = document.createElement('li'),
            moreLink = document.createElement('a'),
            moreList = this.moreList = document.createElement('ul');

        moreElement.classList.add('more-item');
        moreLink.classList.add('more-link');
        moreLink.href = '#';
        moreLink.textContent = '...';
        moreList.classList.add('more-list');
        moreList.classList.add('submenu');
        moreElement.append(moreLink);
        moreElement.append(moreList);
        this.menu.append(moreElement);

        this.moveItemsToMore();
    }

    moveItemsToMore() {
        for (let i = (this.menuItems.length - 1), menuItem; i > -1; i--) {
            menuItem = this.menuItems[i];

            if (menuItem === this.moreElement) {
                continue;
            }
            if (this.menuIsOverflowed()) {
                this.moreList.prepend(menuItem);
            } else {
                break;
            }
        }
    }

    submenuOpen(fullMenuItem) {
        let submenu = fullMenuItem.querySelector('.submenu'),
            windowWidth = document.documentElement.clientWidth;

        submenu.classList.remove('left');
        if ( (submenu.getBoundingClientRect().right > windowWidth) || fullMenuItem.parentElement.classList.contains('left') ) {
            submenu.classList.add('left');
        }
        if (submenu.getBoundingClientRect().left < 0) {
            submenu.classList.remove('left');
        }
        fullMenuItem.classList.add('active');
    }

    submenuClose(fullMenuItem) {
        fullMenuItem.classList.remove('active');
    }

    resize() {
        this.menuWrapper.classList.add('not-ready');
        this.menuWidth = this.menuWrapper.clientWidth;
        this.menu.innerHTML = '';
        this.menu.append(...this.startItems);

        if (this.menuIsOverflowed()) {
            this.menu.append(this.moreElement);
            this.moveItemsToMore();
        }

        this.menuWrapper.classList.remove('not-ready');
    }
}

window.addEventListener('load', function() {
    let myMenu = new Menu('.menu-wrapper');
    myMenu.init();
})