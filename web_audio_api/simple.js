// 前缀兼容
// ['','webkit','moz','ms'].forEach(function (pre) {
//     var prefix = pre + 'AudioContext';
//     if ( !window.AudioContext && window[prefix] ) {
//         window.AudioContext = window[prefix];
//     }
// });

// 请求音频文件
function fetchAudioSource (url, successCallback) {
    if ( url && typeof url === 'string' ) {
        var request = new XMLHttpRequest();
        request.open('GET', url, true);
        // 以二进制缓冲的方式存储音频文件数据
        request.responseType = 'arraybuffer';
        request.onload = function() {
            successCallback(request.response);
        }
        request.send();
    }
}

// 解码音频文件
function decodeAudio (audioCtx, audioData, callback) {
    if ( audioData ) {
        audioCtx.decodeAudioData(
            audioData,
            // on success
            function (buffer) {
                callback && callback(buffer);
            },
            // on fail
            function(e) {
                console.log('Fail to decode the file!');
            }
        )
    }
}

document.querySelector('.btn-group').onclick = function(event){
    var btn = event.target;
    gainNode.gain.value = btn.getAttribute('data-value');
};


// 创建音频上下文对象
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
// 创建音源节点
var sourceNode = audioCtx.createBufferSource();
// 加一个增益节点，用于控制音量
var gainNode = audioCtx.createGain();

fetchAudioSource('./res/我.mp3', function (re) {
    // 设置音量大小，默认值为1 - 无增益或衰减
    gainNode.gain.value = 1;
    // gainNode.gain.value = 0.5;
    // 解码
    decodeAudio(audioCtx, re, function (sourceBuffer) {
        sourceNode.buffer = sourceBuffer;
        // 连接各节点
        // source node -> gain node -> destination node
        sourceNode.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        // 播放
        sourceNode.start(0);
    });

});
