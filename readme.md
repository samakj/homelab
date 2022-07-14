# Notes

If esp device is not showing up on ttyUSB0, this could be an issue with the CH341 driver and brltty (the braile tty driver).

You can see this happening if you run `sudo dmesg` and there is something like this in there:

```
[31018.832993] usb 3-2.2: new full-speed USB device number 15 using xhci_hcd
[31018.974611] usb 3-2.2: New USB device found, idVendor=1a86, idProduct=7523, bcdDevice= 2.54
[31018.974621] usb 3-2.2: New USB device strings: Mfr=0, Product=2, SerialNumber=0
[31018.974624] usb 3-2.2: Product: USB2.0-Ser!
[31019.032730] ch341 3-2.2:1.0: ch341-uart converter detected
[31019.045653] ch341-uart ttyUSB0: break control not supported, using simulated break
[31019.045791] usb 3-2.2: ch341-uart converter now attached to ttyUSB0
[31019.588212] input: BRLTTY 6.4 Linux Screen Driver Keyboard as /devices/virtual/input/input48
[31019.725612] usb 3-2.2: usbfs: interface 0 claimed by ch341 while 'brltty' sets config #1
[31019.729346] ch341-uart ttyUSB0: ch341-uart converter now disconnected from ttyUSB0
[31019.729484] ch341 3-2.2:1.0: device disconnected
[31192.152770] usb 3-2.2: USB disconnect, device number 15
```

Disabling the brltty driver fixes this:

```
systemctl stop brltty-udev.service
sudo systemctl mask brltty-udev.service
systemctl stop brltty.service
systemctl disable brltty.service
```

The user will also need to be added to the dialout group, (requires re-log to take affect):

```
sudo usermod -a -G dialout $USER
```