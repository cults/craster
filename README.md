Craster
=======

Turn 3D models into a set of PNGs.

Rasterization thanks to JSC3D, browser emulation thanks to PhantomJS and
captures thanks to CasperJS.

Usage
------

    $ bin/craster --help
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
          --port [NUMBER]    Port for the temporary http server that serves the
                             viewer  (Default is 3222)
      -s, --no-progress      Disable progress
      -k, --no-color         Omit color from output
          --debug            Show debug information
      -v, --version          Display the current version
      -h, --help             Display help and usage details

Install
-------

    $ git clone https://github.com/sunny/craster
    $ cd craster
    $ npm install -g

Test
---

    $ craster --url 'http://localhost:3222/example.stl'
    $ open tmp/craster-*
