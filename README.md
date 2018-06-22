# node-mongodb-pingpong

Measure latency of mongodb by repeating one request with node.js

## usage

1. edit `src/index.js` and change HOSTNAME
    - default is `mongodb://127.0.0.1:27017/pingpong`
1. yarn
1. yarn bulid
1. yarn benchmark

## output

```
time	latency
time	latency
time	latency
time	latency
time	latency
...
```

- `time` is the request start time (ms) from process start
- `latency` is latency (ms)
