import { Injectable } from '@angular/core'
import AWN from 'awesome-notifications'

// Set global options
const globalOptions = {
  position: 'bottom-right',
  duration: 2000,
}

// Initialize instance of AWN
const notifier = new AWN(globalOptions)

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  constructor() {}

  successToast(msg) {
    notifier.success(msg, 'Success', globalOptions)
  }
  errorToast(msg) {
    notifier.alert(msg, 'Error', globalOptions)
  }
  warningToast(msg) {
    notifier.warning(msg, 'Warning', globalOptions)
  }
  infoToast(msg) {
    notifier.info(msg, 'Info', globalOptions)
  }
  tipToast(msg) {
    notifier.tip(msg, globalOptions)
  }
  asyncToast(msg) {
    notifier.async(msg)
  }
  asyncBlock(msg) {
    notifier.asyncBlock(msg)
  }
  modal(msg) {
    notifier.modal(msg)
  }

}
