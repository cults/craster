Craster
=======

Turn 3D models into PNGs.

Rasterization thanks to JSC3D, browser emulation and captures thanks to
PhantomJS.

Usage
------

    $ craster --help
    Usage:
      craster [OPTIONS] [ARGS]

    Options:
      -u, --url STRING       URL of the 3D model
      -p, --path [PATH]      Captures path (Default is tmp/craster)
      -n, --num [NUMBER]     Number of captures (Default is 20)
      -x NUMBER              3D X (Default is 0)
      -y NUMBER              3D Y for the start (Default is 0)
      -z NUMBER              3D Z (Default is 0)
      -W, --width [NUMBER]   Image width (Default is 1000)
      -H, --height [NUMBER]  Image height (Default is 1000)
      -s, --no-progress      Disable progress
          --port NUMBER      Port for the temporary http server that serves the
                             viewer
          --debug-wait       Keep http server open
      -k, --no-color         Omit color from output
          --debug            Show debug information
      -v, --version          Display the current version
      -h, --help             Display help and usage details

Install
-------

    $ npm install -g craster


Local Development
-----------------

    $ git clone https://github.com/sunny/craster
    $ cd craster
    $ npm install

### Compile

    $ coffee --compile capture.coffee

### Try with a fake file

    $ bin/craster --port 3222 --url 'http://0.0.0.0:3222/example.stl' --debug --debug-wait
    $ open tmp/craster-*

### Publish

Change the version in `package.json`, then:

    $ git commit -m 'v42.0.0'
    $ git tag v42.0.0
    $ git push
    $ npm publish
