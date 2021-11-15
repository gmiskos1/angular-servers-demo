import { NgModule } from '@angular/core';
import { notifierCustomConfigFactory, NotifierModule, NotifierOptions } from 'angular-notifier';

const customNotifierOptions: NotifierOptions={
  position: {

    horizontal: {

      /**
       * Defines the horizontal position on the screen
       * @type {'left' | 'middle' | 'right'}
       */
      position: 'left',

      /**
       * Defines the horizontal distance to the screen edge (in px)
       * @type {number}
       */
      distance: 12

    },

    vertical: {

      /**
       * Defines the vertical position on the screen
       * @type {'top' | 'bottom'}
       */
      position: 'bottom',

      /**
       * Defines the vertical distance to the screen edge (in px)
       * @type {number}
       */
      distance: 12,

      /**
       * Defines the vertical gap, existing between multiple notifications (in px)
       * @type {number}
       */
      gap: 10

    }

  },
  theme: 'material',
  behaviour:{
    autoHide: 5000,
    onClick: 'hide',
    onMouseover: 'pauseAutoHide',
    showDismissButton: true,
    stacking: 4
  },
  animations:{
    enabled: true,
    show:{
      preset: 'slide',
      speed: 300,
      easing: 'ease'
    },
    hide: {
      preset: 'fade',
      speed: 300,
      easing: 'ease'
    },
    shift: {
      speed: 300,
      easing: 'ease'
    },
    overlap: 150
  }
};

@NgModule({
  imports: [
    NotifierModule.withConfig(customNotifierOptions)
  ],
  exports: [NotifierModule]
})
export class NotificationModule { }
