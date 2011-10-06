
var _divResizeId = "!! OVERRIDE ME !!";

function _divResize () {
	var _div = document.getElementById (_divResizeId);
	var _top = 0;
	var _left = 0;
	var _parentDiv = _div;
	while (true) {
		if (_parentDiv.y)
			_top += _parentDiv.y;
		if (_parentDiv.x)
			_left += _parentDiv.x;
		_top += _parentDiv.offsetTop;
		_left += _parentDiv.offsetLeft;
		if (!_parentDiv.offsetParent)
			break;
		_parentDiv = _parentDiv.offsetParent;
	}
	_div.style.height = (window.innerHeight - _top - 64) + "px";
	_div.style.width = (window.innerWidth - _left - 64) + "px";
	setTimeout (_divResize, 1000);
}
