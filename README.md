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
      -i, --image PATH       Path to final image
      -n, --num [NUMBER]     Number of captures (Default is 20)
      -x NUMBER              3D X (Default is 0)
      -y NUMBER              3D Y for the start (Default is 0)
      -z NUMBER              3D Z (Default is 0)
      -W, --width [NUMBER]   Image width (Default is 1000)
      -H, --height [NUMBER]  Image height (Default is 1000)
      -c, --color [STRING]   Color for the 3D model (Default is eeeeee)
      -s, --no-progress      Disable progress
          --port NUMBER      Port for the http server that serves the viewer
          --server           Keep the http server open
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

### Try with a fake file

    $ bin/craster --port 4000 --url 'http://0.0.0.0:4000/example.stl' --debug
    $ open tmp/craster-*

### Release

Change the version in `package.json`, update the `CHANGELOG.md`, then:

    $ npm install
    $ git add package.json package-lock.json CHANGELOG.md
    $ git commit -m v`jq -r '.version' < package.json`
    $ git tag v`jq -r '.version' < package.json`
    $ git push && git push --tags
    $ npm publish
