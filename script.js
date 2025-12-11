// 存储用户上传的图片数据
let aa1 = []; // 存储图片对象 {id, filename, dataURL, file, width, height}
let bb2 = []; // 当前图片顺序（存储图片ID，null表示空位）
let cc3 = 1; // 图片ID计数器

// 获取DOM元素
const dd4 = document.getElementById('rows');
const ee5 = document.getElementById('cols');
const ff6 = document.getElementById('gap');
const gg7 = document.getElementById('maxWidth');
const hh8 = document.getElementById('submitBtn');
const ii9 = document.getElementById('resetBtn');
const jj10 = document.getElementById('saveBtn');
const kk11 = document.getElementById('imageGrid');
const ll12 = document.getElementById('currentRows');
const mm13 = document.getElementById('currentCols');
const nn14 = document.getElementById('currentGap');
const oo15 = document.getElementById('totalImages');
const pp16 = document.getElementById('statCols');
const qq17 = document.getElementById('statRows');
const rr18 = document.getElementById('statGap');
const ss19 = document.getElementById('statTotal');
const tt20 = document.getElementById('statGridSize');
const uu21 = document.getElementById('statCellSize');
const vv22 = document.getElementById('statMaxWidth');
const ww23 = document.getElementById('widthWarning');
const xx24 = document.getElementById('warningWidth');
const yy25 = document.getElementById('warningMaxWidth');
const zz26 = document.getElementById('currentWidthInfo');
const aaa27 = document.getElementById('saveInfo');
const bbb28 = document.getElementById('saveProgress');
const ccc29 = document.getElementById('savePreviewContainer');
const ddd30 = document.getElementById('savePreview');
const eee31 = document.getElementById('previewCloseBtn');
const fff32 = document.getElementById('progressPercent');
const ggg33 = document.getElementById('progressBarFill');
const hhh34 = document.getElementById('savedFileName');
const iii35 = document.getElementById('fileSizeInfo');
const jjj36 = document.getElementById('mainContainer');
const kkk37 = document.getElementById('donationQR');
const lll38 = document.getElementById('uploadProgress');
const mmm39 = document.getElementById('uploadPercent');
const nnn40 = document.getElementById('uploadProgressBarFill');
const ooo41 = document.getElementById('uploadInfo');
const ppp42 = document.getElementById('loadedCount');
const qqq43 = document.getElementById('totalCount');
const rrr44 = document.getElementById('multiDragArea');
const sss45 = document.getElementById('browseMultiBtn');
const ttt46 = document.getElementById('compressionControl');
const uuu47 = document.getElementById('compressionSlider');
const vvv48 = document.getElementById('compressionQualityValue');

// 图片设置
const www49 = 0.85; // 默认图片质量（0.85 = 85%）
const xxx50 = 100; // 预览时的单元格大小
const yyy51 = 50; // 保存时的最小单元格尺寸
const zzz52 = 2000; // 保存时的最大单元格尺寸
const aaaa53 = 8000; // 默认最大宽度

// 初始设置
let bbbb54 = 10;
let cccc55 = 6;
let dddd56 = 10; // 百分比
let eeee57 = aaaa53;
let ffff58 = 200; // 实际保存时的单元格大小
let gggg59 = www49; // 当前图片质量设置

// 拖拽功能变量
let hhhh60 = null; // 当前被拖拽的元素
let iiii61 = -1; // 拖拽起始位置
let jjjj62 = false;
let kkkk63 = false; // 是否是外部文件拖拽
let llll64 = null; // 当前拖拽经过的元素
let mmmm65 = null; // 拖拽离开的定时器

// 图片上传状态
let nnnn66 = []; // 当前正在上传的文件
let oooo67 = 0; // 已上传的图片数量
let pppp68 = 0; // 总共需要上传的图片数量

// 计算实际间隔像素值（基于单元格大小的百分比）
function qqqq69(a1, b2) {
	return Math.floor(a1 * b2 / 100);
}

// 计算网格宽度
function rrrr70(a1, b2, c3) {
	const d4 = qqqq69(b2, c3);
	return a1 * b2 + (a1 - 1) * d4;
}

// 计算网格高度
function ssss71(a1, b2, c3) {
	const d4 = qqqq69(b2, c3);
	return a1 * b2 + (a1 - 1) * d4;
}

// 自动调整单元格大小以适应最大宽度限制
function tttt72(a1, b2, c3) {
	let d4 = c3;
	
	// 计算当前宽度
	const e5 = rrrr70(a1, d4, b2);
	
	// 如果超过最大宽度，自动调整单元格大小
	if (e5 > eeee57) {
		// 计算最大允许的单元格大小
		const f6 = qqqq69(d4, b2);
		// 公式: maxWidth = cols * cellSize + (cols - 1) * (cellSize * gapPercent / 100)
		// 解方程: cellSize * (cols + (cols - 1) * gapPercent / 100) = maxWidth
		const g7 = a1 + (a1 - 1) * b2 / 100;
		d4 = Math.floor(eeee57 / g7);
		
		console.log(`自动调整单元格大小: ${c3}px -> ${d4}px`);
	}
	
	// 确保在合理范围内
	d4 = Math.max(yyy51, Math.min(d4, zzz52));
	
	return d4;
}

// 检查宽度是否超过限制
function uuuu73(a1, b2, c3) {
	const d4 = rrrr70(a1, b2, c3);
	const e5 = ssss71(bbbb54, b2, c3);
	
	return {
		width: d4,
		height: e5,
		isValid: d4 <= eeee57
	};
}

// 更新宽度信息显示
function vvvv74(a1, b2, c3) {
	const d4 = uuuu73(a1, b2, c3);
	const e5 = d4.width;
	const f6 = d4.height;
	
	zz26.textContent = `当前尺寸: ${e5}px × ${f6}px`;
	zz26.style.color = d4.isValid ? '#3498db' : '#e74c3c';
	
	return d4;
}

// 显示宽度警告
function wwww75(a1) {
	xx24.textContent = a1;
	yy25.textContent = eeee57;
	ww23.classList.add('h8-17');
}

// 隐藏宽度警告
function xxxx76() {
	ww23.classList.remove('h8-17');
}

// 显示保存信息
function yyyy77(a1, b2) {
	hhh34.textContent = a1;
	
	if (b2) {
		const c3 = (b2 / (1024 * 1024)).toFixed(2);
		const d4 = (b2 / 1024).toFixed(1);
		
		let e5;
		if (b2 >= 1024 * 1024) {
			e5 = `${c3} MB`;
		} else {
			e5 = `${d4} KB`;
		}
		
		const f6 = `(质量: ${Math.round(gggg59 * 100)}%)`;
		iii35.textContent = `文件大小: ${e5} ${f6}`;
	}
	
	aaa27.classList.add('h8-17');
	
	// 5秒后自动隐藏
	setTimeout(() => {
		aaa27.classList.remove('h8-17');
	}, 5000);
}

// 隐藏保存信息
function zzzz78() {
	aaa27.classList.remove('h8-17');
}

// 显示保存预览
function aaaaa79() {
	ccc29.classList.add('h8-17');
}

// 隐藏保存预览
function bbbbb80() {
	ccc29.classList.remove('h8-17');
}

// 显示保存进度
function ccccc81() {
	bbb28.classList.add('h8-17');
	jj10.disabled = true;
	jj10.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在生成...';
}

// 更新保存进度
function ddddd82(a1) {
	fff32.textContent = a1;
	ggg33.style.width = `${a1}%`;
}

// 隐藏保存进度
function eeeee83() {
	bbb28.classList.remove('h8-17');
	jj10.disabled = false;
	jj10.innerHTML = '<i class="fas fa-download"></i> 保存为大图片';
}

// 显示上传进度
function fffff84() {
	lll38.classList.add('h8-17');
}

// 更新上传进度
function ggggg85(a1) {
	mmm39.textContent = Math.min(100, Math.max(0, a1));
	nnn40.style.width = `${Math.min(100, Math.max(0, a1))}%`;
}

// 更新上传信息
function hhhhh86(a1, b2) {
	ppp42.textContent = a1;
	qqq43.textContent = b2;
}

// 隐藏上传进度
function iiiii87() {
	lll38.classList.remove('h8-17');
}

// 重置上传进度
function jjjjj88() {
	oooo67 = 0;
	pppp68 = 0;
	ggggg85(0);
	hhhhh86(0, 0);
}

// 启用/禁用控件
function kkkkk89(a1) {
	hh8.disabled = !a1;
	
	// 更新预设按钮状态
	document.querySelectorAll('.b4-62, .e7-65').forEach(btn => {
		if (a1) {
			btn.classList.remove('c5-63');
		} else {
			btn.classList.add('c5-63');
		}
	});
}

// 根据图片ID获取图片对象
function lllll90(a1) {
	return aa1.find(img => img.id === a1);
}

// 根据图片ID删除图片
function mmmmm91(a1) {
	// 从用户图片数组中删除
	const b2 = aa1.findIndex(img => img.id === a1);
	if (b2 !== -1) {
		aa1.splice(b2, 1);
	}
	
	// 从当前图片顺序中删除（设置为null，保留位置）
	const c3 = bb2.indexOf(a1);
	if (c3 !== -1) {
		bb2[c3] = null; // 设置为null，保留空位
	}
	
	console.log(`删除图片 ID: ${a1}，保留空位`);
}

// 计算所有图片的平均尺寸，用于确定初始单元格大小
function nnnnn92() {
	if (aa1.length === 0) return 200; // 默认值
	
	let b2 = 0;
	let c3 = 0;
	
	for (const d4 of aa1) {
		if (d4.originalWidth && d4.originalHeight) {
			// 使用面积的平均值的平方根作为尺寸参考
			b2 += d4.originalWidth * d4.originalHeight;
			c3++;
		}
	}
	
	if (c3 === 0) return 200;
	
	// 计算平均面积的平方根，作为尺寸参考
	const e5 = Math.sqrt(b2 / c3);
	
	// 使用平均尺寸的60%，但要保持在最小和最大值之间
	const f6 = e5 * 0.6;
	return Math.max(yyy51, Math.min(f6, zzz52));
}

// 更新网格尺寸显示
function ooooo93() {
	// 根据图片原始尺寸计算合适的单元格大小
	const a1 = nnnnn92();
	
	// 自动调整单元格大小以适应最大宽度
	ffff58 = tttt72(cccc55, dddd56, a1);
	
	// 计算网格尺寸
	const b2 = qqqq69(ffff58, dddd56);
	const c3 = rrrr70(cccc55, ffff58, dddd56);
	const d4 = ssss71(bbbb54, ffff58, dddd56);
	
	// 更新统计信息中的网格尺寸
	tt20.textContent = `${Math.round(c3)}×${Math.round(d4)}px`;
	uu21.textContent = `${Math.round(ffff58)}px`;
	
	// 检查宽度限制并更新信息
	const e5 = uuuu73(cccc55, ffff58, dddd56);
	
	// 如果宽度仍然超过限制（调整后），显示警告
	if (!e5.isValid) {
		wwww75(e5.width);
		// 但仍然允许操作，因为我们已自动调整了大小
	} else {
		xxxx76();
	}
	
	// 更新宽度信息显示
	vvvv74(cccc55, ffff58, dddd56);
	
	return e5;
}

// 初始化图片网格
function ppppp94() {
	// 清空网格容器
	kk11.innerHTML = '';
	
	// 更新网格尺寸显示并检查宽度限制
	ooooo93();
	
	// 设置预览网格样式（使用固定的100px单元格）
	kk11.style.gridTemplateColumns = `repeat(${cccc55}, ${xxx50}px)`;
	kk11.style.gridTemplateRows = `repeat(${bbbb54}, ${xxx50}px)`;
	
	// 计算预览时的间隔（基于预览单元格大小的百分比）
	const a1 = qqqq69(xxx50, dddd56);
	kk11.style.gap = `${a1}px`;
	
	// 计算总单元格数
	const b2 = bbbb54 * cccc55;
	
	// 确保bb2长度正确
	while (bb2.length < b2) {
		bb2.push(null);
	}
	
	// 如果当前图片数量超过总单元格数，截断多余部分
	if (bb2.length > b2) {
		bb2 = bb2.slice(0, b2);
	}
	
	// 创建网格单元格
	for (let c3 = 0; c3 < b2; c3++) {
		const d4 = document.createElement('div');
		d4.className = 'o1-49 s5-53';
		d4.setAttribute('data-index', c3);
		d4.setAttribute('draggable', 'true');
		
		// 检查当前位置是否有图片
		const e5 = bb2[c3];
		if (e5) {
			const f6 = lllll90(e5);
			
			if (f6) {
				// 更新className
				d4.className = 'o1-49';
				
				// 创建图片元素
				const g7 = document.createElement('img');
				g7.src = f6.dataURL;
				g7.alt = f6.filename;
				g7.setAttribute('data-image-id', e5);
				
				// 创建显示文件名的元素
				const h8 = document.createElement('span');
				h8.className = 'q3-51';
				h8.textContent = f6.filename;
				
				// 创建拖拽手柄
				const i9 = document.createElement('div');
				i9.className = 't6-54';
				i9.innerHTML = '<i class="fas fa-arrows-alt"></i>';
				
				// 创建删除按钮
				const j10 = document.createElement('button');
				j10.className = 'r4-52';
				j10.innerHTML = '<i class="fas fa-times"></i>';
				j10.setAttribute('data-image-id', e5);
				j10.addEventListener('click', function(e) {
					e.stopPropagation(); // 阻止事件冒泡
					const k11 = this.getAttribute('data-image-id');
					mmmmm91(parseInt(k11));
					qqqqq95();
				});
				
				d4.appendChild(g7);
				d4.appendChild(h8);
				d4.appendChild(i9);
				d4.appendChild(j10);
			} else {
				// 图片对象不存在，显示占位符
				d4.textContent = '空位';
				d4.innerHTML += '<div class="t6-54"><i class="fas fa-plus"></i></div>';
			}
		} else {
			// 空位占位符
			d4.textContent = '空位';
			d4.innerHTML += '<div class="t6-54"><i class="fas fa-plus"></i></div>';
		}
		
		// 添加拖拽事件（网格内拖拽）
		rrrrr96(d4);
		
		kk11.appendChild(d4);
	}
	
	// 更新界面信息
	sssss97();
}

// 更新网格信息
function sssss97() {
	const a1 = aa1.length;
	
	// 更新界面显示
	ll12.textContent = bbbb54;
	mm13.textContent = cccc55;
	nn14.textContent = dddd56;
	oo15.textContent = a1;
	
	pp16.textContent = cccc55;
	qq17.textContent = bbbb54;
	rr18.textContent = dddd56 + '%';
	ss19.textContent = a1;
	vv22.textContent = eeee57;
	
	// 更新网格尺寸显示
	ooooo93();
	
	// 更新保存按钮状态
	jj10.disabled = a1 === 0;
}

// 添加拖拽事件到图片元素
function rrrrr96(a1) {
	// 拖拽开始
	a1.addEventListener('dragstart', ttttt98);
	
	// 拖拽经过
	a1.addEventListener('dragover', uuuuu99);
	
	// 拖拽进入
	a1.addEventListener('dragenter', vvvvv100);
	
	// 拖拽离开
	a1.addEventListener('dragleave', wwwww101);
	
	// 放置
	a1.addEventListener('drop', xxxxx102);
	
	// 拖拽结束
	a1.addEventListener('dragend', yyyyy103);
	
	// 点击事件（用于选择文件）
	a1.addEventListener('click', zzzzz104);
}

// 处理网格项点击事件
function zzzzz104(e) {
	// 如果点击的是删除按钮，不处理
	if (e.target.closest('.r4-52')) {
		return;
	}
	
	// 只有空位占位符才允许点击选择文件
	if (this.classList.contains('s5-53') && this.textContent === '空位') {
		// 创建文件输入元素
		const a1 = document.createElement('input');
		a1.type = 'file';
		a1.accept = 'image/*';
		a1.multiple = false; // 网格内只允许选择单张图片
		a1.style.display = 'none';
		
		a1.onchange = (e) => {
			const b2 = e.target.files;
			if (b2.length > 0) {
				// 获取当前项的索引
				const c3 = parseInt(this.getAttribute('data-index'));
				aaaaaa105(b2[0], c3);
			}
		};
		
		document.body.appendChild(a1);
		a1.click();
		document.body.removeChild(a1);
	}
}

// 拖拽开始
function ttttt98(e) {
	// 如果是空位占位符，不允许拖拽
	if (this.classList.contains('s5-53') && this.textContent === '空位') {
		e.preventDefault();
		return;
	}
	
	// 停止事件传播，避免触发外部拖拽
	e.stopPropagation();
	
	hhhh60 = this;
	iiii61 = parseInt(this.getAttribute('data-index'));
	kkkk63 = false;
	
	// 设置拖拽效果
	this.classList.add('p2-50');
	e.dataTransfer.effectAllowed = 'move';
	
	// 存储被拖拽图片的ID
	const a1 = this.querySelector('img');
	if (a1) {
		const b2 = a1.getAttribute('data-image-id');
		e.dataTransfer.setData('text/plain', b2);
		e.dataTransfer.setData('text/index', iiii61.toString());
	}
	
	// 设置拖拽图像
	const c3 = this.cloneNode(true);
	c3.style.width = '80px';
	c3.style.height = '80px';
	c3.style.position = 'absolute';
	c3.style.top = '-1000px';
	document.body.appendChild(c3);
	e.dataTransfer.setDragImage(c3, 40, 40);
	
	setTimeout(() => {
		document.body.removeChild(c3);
	}, 0);
	
	jjjj62 = true;
}

// 拖拽经过
function uuuuu99(e) {
	if (e.preventDefault) {
		e.preventDefault(); // 允许放置
	}
	
	// 检查是否是外部文件拖拽
	if (e.dataTransfer.types.includes('Files')) {
		e.dataTransfer.dropEffect = 'copy';
		kkkk63 = true;
	} else {
		e.dataTransfer.dropEffect = 'move';
		kkkk63 = false;
	}
	
	// 停止事件传播
	e.stopPropagation();
	return false;
}

// 拖拽进入
function vvvvv100(e) {
	// 清除之前的定时器
	if (mmmm65) {
		clearTimeout(mmmm65);
		mmmm65 = null;
	}
	
	// 停止事件传播
	e.stopPropagation();
	
	// 移除之前元素的样式
	if (llll64 && llll64 !== this) {
		llll64.classList.remove('def-2');
	}
	
	// 记录当前拖拽经过的元素
	llll64 = this;
	
	// 显示高亮样式
	this.classList.add('def-2');
}

// 拖拽离开
function wwwww101(e) {
	// 停止事件传播
	e.stopPropagation();
	
	const a1 = this;
	
	// 使用定时器延迟移除样式，避免闪烁
	if (mmmm65) {
		clearTimeout(mmmm65);
	}
	
	mmmm65 = setTimeout(() => {
		a1.classList.remove('def-2');
		
		// 如果离开的是当前拖拽经过的元素，清除记录
		if (llll64 === a1) {
			llll64 = null;
		}
	}, 50);
}

// 放置
function xxxxx102(e) {
	e.stopPropagation(); // 阻止事件冒泡
	e.preventDefault(); // 阻止默认行为
	
	// 清除拖拽离开的定时器
	if (mmmm65) {
		clearTimeout(mmmm65);
		mmmm65 = null;
	}
	
	// 移除所有拖拽样式
	document.querySelectorAll('.o1-49, .s5-53').forEach(item => {
		item.classList.remove('def-2');
	});
	
	// 重置拖拽元素记录
	llll64 = null;
	
	// 获取目标索引
	const a1 = parseInt(this.getAttribute('data-index'));
	
	// 如果是外部文件拖拽
	if (kkkk63 && e.dataTransfer.files.length > 0) {
		const b2 = e.dataTransfer.files;
		
		// 只处理拖拽到指定位置的单张图片
		// 如果拖拽多张图片，只处理第一张
		const c3 = e.dataTransfer.files[0];
		
		// 检查目标位置是否为空
		if (bb2[a1] === null) {
			// 目标位置为空，直接放置
			aaaaaa105(c3, a1);
		} else {
			// 目标位置有图片，询问是否替换
			if (confirm('目标位置已有图片，是否替换？')) {
				// 删除原有图片
				const d4 = bb2[a1];
				if (d4) {
					mmmmm91(d4);
				}
				// 放置新图片
				aaaaaa105(c3, a1);
			} else {
				// 用户取消，不执行任何操作
			}
		}
		
		// 隐藏多图拖拽区域的高亮
		rrr44.classList.remove('def-2');
	} 
	// 如果是内部拖拽（交换位置）
	else if (hhhh60 && iiii61 !== -1 && a1 !== -1 && !kkkk63) {
		// 交换bb2数组中的元素
		const e5 = bb2[iiii61];
		bb2[iiii61] = bb2[a1];
		bb2[a1] = e5;
		
		// 重新渲染网格
		qqqqq95();
		
		console.log(`交换位置: 从 ${iiii61} 到 ${a1}`);
	}
	
	return false;
}

// 处理单张图片文件
function aaaaaa105(a1, b2) {
	// 检查是否是图片文件
	if (!a1.type.startsWith('image/')) {
		alert('请选择有效的图片文件 (JPG, PNG, GIF等)');
		return;
	}
	
	// 显示上传进度
	fffff84();
	ggggg85(10);
	
	// 确保目标索引有效
	const c3 = bbbb54 * cccc55;
	if (b2 < 0 || b2 >= c3) {
		alert('目标位置无效');
		iiiii87();
		return;
	}
	
	// 设置上传信息
	jjjjj88();
	pppp68 = 1;
	oooo67 = 0;
	hhhhh86(0, 1);
	
	const d4 = new FileReader();
	
	d4.onload = function(e) {
		// 创建临时图片元素来获取原始尺寸
		const f6 = new Image();
		f6.onload = function() {
			// 创建图片对象，包含原始尺寸
			const g7 = {
				id: cc3++,
				filename: a1.name,
				dataURL: e.target.result,
				file: a1,
				originalWidth: f6.naturalWidth,
				originalHeight: f6.naturalHeight,
				aspectRatio: f6.naturalWidth / f6.naturalHeight
			};
			
			console.log(`图片 ${a1.name} 原始尺寸: ${f6.naturalWidth}x${f6.naturalHeight}, 宽高比: ${g7.aspectRatio}`);
			
			// 添加到用户图片数组
			aa1.push(g7);
			
			// 放置到指定位置
			bb2[b2] = g7.id;
			
			// 更新上传进度
			ggggg85(100);
			hhhhh86(1, 1);
			
			// 更新网格尺寸并重新渲染
			ooooo93();
			qqqqq95();
			
			// 完成上传
			setTimeout(() => {
				iiiii87();
				jjjjj88();
			}, 500);
			
			console.log(`在位置 ${b2} 添加了图片 ${a1.name}`);
		};
		
		f6.onerror = function() {
			console.error(`获取图片尺寸失败: ${a1.name}`);
			// 如果无法获取尺寸，使用默认值
			const h8 = {
				id: cc3++,
				filename: a1.name,
				dataURL: e.target.result,
				file: a1,
				originalWidth: 800,
				originalHeight: 600,
				aspectRatio: 800/600
			};
			
			// 添加到用户图片数组
			aa1.push(h8);
			
			// 放置到指定位置
			bb2[b2] = h8.id;
			
			// 更新上传进度
			ggggg85(100);
			hhhhh86(1, 1);
			
			// 更新网格尺寸并重新渲染
			ooooo93();
			qqqqq95();
			
			// 完成上传
			setTimeout(() => {
				iiiii87();
				jjjjj88();
			}, 500);
		};
		
		f6.src = e.target.result;
	};
	
	d4.onerror = function() {
		console.error(`读取文件失败: ${a1.name}`);
		alert('读取文件失败，请重试');
		iiiii87();
	};
	
	d4.readAsDataURL(a1);
}

// 处理多张图片文件（从多图拖拽区域）
function bbbbbb106(a1) {
	// 过滤出图片文件
	const b2 = Array.from(a1).filter(c3 => 
		c3.type.startsWith('image/')
	);
	
	if (b2.length === 0) {
		alert('请选择有效的图片文件 (JPG, PNG, GIF等)');
		return;
	}
	
	// 重置上传进度
	jjjjj88();
	
	// 显示上传进度
	fffff84();
	ggggg85(5);
	
	// 计算总单元格数
	const d4 = bbbb54 * cccc55;
	
	// 收集所有空位
	const e5 = [];
	for (let f6 = 0; f6 < d4; f6++) {
		if (bb2[f6] === null) {
			e5.push(f6);
		}
	}
	
	// 如果没有空位
	if (e5.length === 0) {
		alert('网格已满，请先增加网格大小或删除一些图片');
		iiiii87();
		return;
	}
	
	// 限制实际可上传的图片数量
	const g7 = b2.slice(0, Math.min(e5.length, b2.length));
	
	if (g7.length < b2.length) {
		alert(`网格中只有 ${e5.length} 个空位，只上传前 ${e5.length} 张图片`);
	}
	
	// 更新总上传数量
	pppp68 = g7.length;
	hhhhh86(0, pppp68);
	
	// 使用Promise.all来并行处理所有图片
	const h8 = g7.map((i9, j10) => {
		return new Promise((k11) => {
			const l12 = new FileReader();
			
			l12.onload = function(m13) {
				// 创建临时图片元素来获取原始尺寸
				const n14 = new Image();
				n14.onload = function() {
					// 创建图片对象，包含原始尺寸
					const o15 = {
						id: cc3++,
						filename: i9.name,
						dataURL: m13.target.result,
						file: i9,
						originalWidth: n14.naturalWidth,
						originalHeight: n14.naturalHeight,
						aspectRatio: n14.naturalWidth / n14.naturalHeight
					};
					
					console.log(`图片 ${i9.name} 原始尺寸: ${n14.naturalWidth}x${n14.naturalHeight}, 宽高比: ${o15.aspectRatio}`);
					k11({
						p16: o15,
						q17: e5[j10]
					});
					
					// 更新上传进度
					oooo67++;
					hhhhh86(oooo67, pppp68);
					const r18 = 5 + Math.floor((oooo67 / pppp68) * 90);
					ggggg85(r18);
				};
				
				n14.onerror = function() {
					console.error(`获取图片尺寸失败: ${i9.name}`);
					// 如果无法获取尺寸，使用默认值
					const s19 = {
						id: cc3++,
						filename: i9.name,
						dataURL: m13.target.result,
						file: i9,
						originalWidth: 800,
						originalHeight: 600,
						aspectRatio: 800/600
					};
					k11({
						p16: s19,
						q17: e5[j10]
					});
					
					// 更新上传进度
					oooo67++;
					hhhhh86(oooo67, pppp68);
					const t20 = 5 + Math.floor((oooo67 / pppp68) * 90);
					ggggg85(t20);
				};
				
				n14.src = m13.target.result;
			};
			
			l12.onerror = function() {
				console.error(`读取文件失败: ${i9.name}`);
				k11(null); // 返回null表示处理失败
				
				// 更新上传进度
				oooo67++;
				hhhhh86(oooo67, pppp68);
				const u21 = 5 + Math.floor((oooo67 / pppp68) * 90);
				ggggg85(u21);
			};
			
			l12.readAsDataURL(i9);
		});
	});
	
	// 等待所有图片处理完成
	Promise.all(h8).then((v22) => {
		// 过滤掉处理失败的图片
		const w23 = v22.filter(x24 => x24 !== null);
		
		if (w23.length === 0) {
			alert('没有有效的图片文件');
			iiiii87();
			return;
		}
		
		// 添加到用户图片数组并放置到指定位置
		w23.forEach(y25 => {
			aa1.push(y25.p16);
			bb2[y25.q17] = y25.p16.id;
		});
		
		// 更新上传进度
		ggggg85(100);
		hhhhh86(w23.length, pppp68);
		
		// 更新网格尺寸并重新渲染
		ooooo93();
		qqqqq95();
		
		// 完成上传
		setTimeout(() => {
			iiiii87();
			jjjjj88();
		}, 500);
		
		console.log(`添加了 ${w23.length} 张图片到空位中`);
	});
}

// 拖拽结束
function yyyyy103(e) {
	// 清除拖拽离开的定时器
	if (mmmm65) {
		clearTimeout(mmmm65);
		mmmm65 = null;
	}
	
	// 移除所有拖拽相关样式
	document.querySelectorAll('.o1-49, .s5-53').forEach(item => {
		item.classList.remove('p2-50');
		item.classList.remove('def-2');
	});
	
	// 重置拖拽状态
	hhhh60 = null;
	iiii61 = -1;
	llll64 = null;
	jjjj62 = false;
	kkkk63 = false;
}

// 重新排序网格（根据bb2重新渲染）
function qqqqq95() {
	const a1 = bbbb54 * cccc55;
	
	// 确保bb2长度正确
	while (bb2.length < a1) {
		bb2.push(null);
	}
	
	// 如果当前图片数量超过总单元格数，截断多余部分
	if (bb2.length > a1) {
		bb2 = bb2.slice(0, a1);
	}
	
	// 重新创建网格
	kk11.innerHTML = '';
	
	for (let b2 = 0; b2 < a1; b2++) {
		const c3 = document.createElement('div');
		c3.className = 'o1-49 s5-53';
		c3.setAttribute('data-index', b2);
		c3.setAttribute('draggable', 'true');
		
		// 检查当前位置是否有图片
		const d4 = bb2[b2];
		if (d4) {
			const e5 = lllll90(d4);
			
			if (e5) {
				// 更新className
				c3.className = 'o1-49';
				
				// 创建图片元素
				const f6 = document.createElement('img');
				f6.src = e5.dataURL;
				f6.alt = e5.filename;
				f6.setAttribute('data-image-id', d4);
				
				// 创建显示文件名的元素
				const g7 = document.createElement('span');
				g7.className = 'q3-51';
				g7.textContent = e5.filename;
				
				// 创建拖拽手柄
				const h8 = document.createElement('div');
				h8.className = 't6-54';
				h8.innerHTML = '<i class="fas fa-arrows-alt"></i>';
				
				// 创建删除按钮
				const i9 = document.createElement('button');
				i9.className = 'r4-52';
				i9.innerHTML = '<i class="fas fa-times"></i>';
				i9.setAttribute('data-image-id', d4);
				i9.addEventListener('click', function(e) {
					e.stopPropagation();
					const j10 = this.getAttribute('data-image-id');
					mmmmm91(parseInt(j10));
					qqqqq95();
				});
				
				c3.appendChild(f6);
				c3.appendChild(g7);
				c3.appendChild(h8);
				c3.appendChild(i9);
			} else {
				// 图片对象不存在，显示占位符
				c3.textContent = '空位';
				c3.innerHTML += '<div class="t6-54"><i class="fas fa-plus"></i></div>';
			}
		} else {
			// 空位占位符
			c3.textContent = '空位';
			c3.innerHTML += '<div class="t6-54"><i class="fas fa-plus"></i></div>';
		}
		
		// 添加拖拽事件
		rrrrr96(c3);
		
		kk11.appendChild(c3);
	}
	
	// 设置预览网格样式
	kk11.style.gridTemplateColumns = `repeat(${cccc55}, ${xxx50}px)`;
	kk11.style.gridTemplateRows = `repeat(${bbbb54}, ${xxx50}px)`;
	const k11 = qqqq69(xxx50, dddd56);
	kk11.style.gap = `${k11}px`;
	
	// 更新网格信息
	sssss97();
	
	console.log('网格重新排序完成，当前顺序:', bb2);
}

// 验证输入并应用设置
function cccccc107() {
	const a1 = parseInt(dd4.value);
	const b2 = parseInt(ee5.value);
	const c3 = parseInt(ff6.value);
	const d4 = parseInt(gg7.value);
	
	// 验证基本输入
	if (isNaN(a1) || a1 < 1 || a1 > 100) {
		alert('请输入有效的行数 (1-100)');
		dd4.focus();
		return false;
	}
	
	if (isNaN(b2) || b2 < 1 || b2 > 100) {
		alert('请输入有效的列数 (1-100)');
		ee5.focus();
		return false;
	}
	
	if (isNaN(c3) || c3 < 0 || c3 > 200) {
		alert('请输入有效的间隔 (0-200%)');
		ff6.focus();
		return false;
	}
	
	if (isNaN(d4) || d4 < 1000 || d4 > 20000) {
		alert('请输入有效的最大宽度 (1000-20000)');
		gg7.focus();
		return false;
	}
	
	// 更新最大宽度
	eeee57 = d4;
	
	// 计算实际单元格大小
	const e5 = nnnnn92();
	ffff58 = tttt72(b2, c3, e5);
	
	// 检查宽度限制
	const f6 = uuuu73(b2, ffff58, c3);
	
	// 如果宽度仍然超过限制，显示警告但不阻止操作
	if (!f6.isValid) {
		wwww75(f6.width);
		// 但仍然允许继续操作
	} else {
		xxxx76();
	}
	
	// 更新设置
	bbbb54 = a1;
	cccc55 = b2;
	dddd56 = c3;
	
	// 调整bb2以适应新的网格大小
	const g7 = bbbb54 * cccc55;
	
	// 如果新网格更大，添加null填充
	if (g7 > bb2.length) {
		while (bb2.length < g7) {
			bb2.push(null);
		}
	} 
	// 如果新网格更小，截断多余部分
	else if (g7 < bb2.length) {
		// 只保留有效的前g7个位置
		bb2 = bb2.slice(0, g7);
	}
	
	// 更新间隔预设按钮状态
	document.querySelectorAll('.e7-65').forEach(btn => {
		btn.classList.remove('e1-39');
		if (parseInt(btn.getAttribute('data-gap')) === dddd56) {
			btn.classList.add('e1-39');
		}
	});
	
	// 重新初始化网格
	ppppp94();
	
	// 添加动画效果
	kk11.style.transform = 'scale(0.98)';
	setTimeout(() => {
		kk11.style.transform = 'scale(1)';
	}, 200);
	
	return true;
}

// 重置排列（清空所有图片）
function dddddd108() {
	// 清空用户图片
	aa1 = [];
	
	// 重置当前图片顺序（全部设为null）
	const a1 = bbbb54 * cccc55;
	bb2 = new Array(a1).fill(null);
	
	// 重置单元格大小
	ffff58 = 200;
	
	// 重置上传进度
	jjjjj88();
	
	// 重新初始化网格
	ppppp94();
	
	// 添加动画效果
	kk11.style.transform = 'scale(0.98)';
	setTimeout(() => {
		kk11.style.transform = 'scale(1)';
	}, 200);
}

// 保存为大图片（带压缩功能）
function eeeeee109() {
	// 显示进度条
	ccccc81();
	ddddd82(10);
	
	// 计算实际间隔像素值
	const a1 = qqqq69(ffff58, dddd56);
	
	// 计算大图片总尺寸（无边框）
	const b2 = rrrr70(cccc55, ffff58, dddd56);
	const c3 = ssss71(bbbb54, ffff58, dddd56);
	
	console.log(`正在生成高分辨率大图片: ${b2}px × ${c3}px, 单元格尺寸: ${ffff58}px, 间隔: ${a1}px (${dddd56}%)`);
	console.log(`图片质量设置: ${gggg59 * 100}%`);
	
	// 检查canvas尺寸限制
	const d4 = 32767;
	if (b2 > d4 || c3 > d4) {
		alert(`图片尺寸过大（${b2}×${c3}），超过浏览器限制（${d4}×${d4}）。请减少行列数或间隔。`);
		eeeee83();
		return;
	}
	
	// 创建canvas元素
	const e5 = document.createElement('canvas');
	e5.width = b2;
	e5.height = c3;
	const f6 = e5.getContext('2d');
	
	// 设置高质量渲染
	f6.imageSmoothingEnabled = true;
	f6.imageSmoothingQuality = 'high';
	
	// 绘制白色背景
	f6.fillStyle = '#ffffff';
	f6.fillRect(0, 0, b2, c3);
	
	ddddd82(30);
	
	// 获取所有图片
	const g7 = bbbb54 * cccc55;
	const h8 = aa1.length;
	
	if (h8 === 0) {
		ffffff110(e5, b2, c3);
		return;
	}
	
	let i9 = 0;
	
	ddddd82(50);
	
	// 绘制图片
	for (let j10 = 0; j10 < g7; j10++) {
		const k11 = Math.floor(j10 / cccc55);
		const l12 = j10 % cccc55;
		
		// 计算图片在canvas中的位置
		const m13 = l12 * (ffff58 + a1);
		const n14 = k11 * (ffff58 + a1);
		
		const o15 = bb2[j10];
		if (o15) {
			const p16 = lllll90(o15);
			
			if (p16) {
				const q17 = new Image();
				q17.onload = () => {
					try {
						const r18 = p16.originalWidth;
						const s19 = p16.originalHeight;
						
						const t20 = Math.min(ffff58 / r18, ffff58 / s19);
						const u21 = r18 * t20;
						const v22 = s19 * t20;
						
						const w23 = m13 + (ffff58 - u21) / 2;
						const x24 = n14 + (ffff58 - v22) / 2;
						
						f6.drawImage(q17, w23, x24, u21, v22);
						
						f6.strokeStyle = '#f0f0f0';
						f6.lineWidth = 1;
						f6.strokeRect(m13, n14, ffff58, ffff58);
					} catch (y25) {
						console.error(`绘制图片失败: ${p16.filename}`, y25);
						gggggg111(f6, m13, n14, ffff58, ffff58, '加载失败');
					}
					
					i9++;
					
					const z26 = 50 + Math.floor((i9 / h8) * 40);
					ddddd82(z26);
					
					if (i9 >= h8) {
						ffffff110(e5, b2, c3);
					}
				};
				
				q17.onerror = () => {
					console.error(`加载图片失败: ${p16.filename}`);
					gggggg111(f6, m13, n14, ffff58, ffff58, '加载失败');
					i9++;
				};
				
				q17.src = p16.dataURL;
			} else {
				gggggg111(f6, m13, n14, ffff58, ffff58, '空位');
				i9++;
			}
		} else {
			gggggg111(f6, m13, n14, ffff58, ffff58, '空位');
			i9++;
		}
	}
}

// 绘制占位符
function gggggg111(a1, b2, c3, d4, e5, f6 = '空位') {
	a1.fillStyle = '#f8f9fa';
	a1.fillRect(b2, c3, d4, e5);
	
	a1.strokeStyle = '#dee2e6';
	a1.lineWidth = 1;
	a1.strokeRect(b2, c3, d4, e5);
	
	a1.fillStyle = '#adb5bd';
	a1.font = `${Math.min(d4, e5) / 8}px Arial`;
	a1.textAlign = 'center';
	a1.textBaseline = 'middle';
	a1.fillText(f6, b2 + d4/2, c3 + e5/2);
}

// 完成保存（带压缩和文件大小计算）
function ffffff110(a1, b2, c3) {
	ddddd82(95);
	
	// 生成带压缩的图片
	const d4 = a1.toDataURL('image/jpeg', gggg59);
	
	// 计算文件大小
	const e5 = d4.length - 'data:image/jpeg;base64,'.length;
	const f6 = Math.floor(e5 * 0.75); // Base64编码的文件大小估算
	
	// 更新预览
	ddd30.src = d4;
	
	// 生成文件名
	const g7 = Math.round(gggg59 * 100);
	const h8 = `grid_${bbbb54}x${cccc55}_gap${dddd56}%_q${g7}_${Date.now()}.jpg`;
	
	ddddd82(100);
	
	// 下载文件
	const i9 = document.createElement('a');
	i9.download = h8;
	i9.href = d4;
	
	document.body.appendChild(i9);
	i9.click();
	document.body.removeChild(i9);
	
	// 显示保存信息
	setTimeout(() => {
		eeeee83();
		yyyy77(h8, f6);
		aaaaa79();
	}, 500);
}

// 事件监听器设置
function hhhhhh112() {
	// 提交按钮点击事件
	hh8.addEventListener('click', function() {
		cccccc107();
	});
	
	// 重置按钮点击事件
	ii9.addEventListener('click', function() {
		dddddd108();
	});
	
	// 保存按钮点击事件
	jj10.addEventListener('click', function() {
		if (jj10.disabled) return;
		eeeeee109();
	});
	
	// 预览关闭按钮点击事件
	eee31.addEventListener('click', function() {
		bbbbb80();
	});
	
	// 点击预览图片也可以关闭
	ddd30.addEventListener('click', function() {
		bbbbb80();
	});
	
	// 间隔预设按钮点击事件
	document.querySelectorAll('.e7-65').forEach(btn => {
		btn.addEventListener('click', function() {
			if (this.classList.contains('c5-63')) return;
			
			const a1 = parseInt(this.getAttribute('data-gap'));
			
			ff6.value = a1;
			
			if (cccccc107()) {
				document.querySelectorAll('.e7-65').forEach(b => {
					b.classList.remove('e1-39');
				});
				this.classList.add('e1-39');
			}
		});
	});
	
	// 布局预设按钮点击事件
	document.querySelectorAll('.b4-62').forEach(btn => {
		btn.addEventListener('click', function() {
			if (this.classList.contains('c5-63')) return;
			
			const a1 = parseInt(this.getAttribute('data-rows'));
			const b2 = parseInt(this.getAttribute('data-cols'));
			const c3 = parseInt(this.getAttribute('data-gap'));
			
			dd4.value = a1;
			ee5.value = b2;
			ff6.value = c3;
			
			if (cccccc107()) {
				document.querySelectorAll('.e7-65').forEach(gapBtn => {
					gapBtn.classList.remove('e1-39');
					if (parseInt(gapBtn.getAttribute('data-gap')) === c3) {
						gapBtn.classList.add('e1-39');
					}
				});
			}
		});
	});
	
	// 最大宽度输入框事件
	gg7.addEventListener('change', function() {
		const a1 = parseInt(this.value);
		
		if (isNaN(a1) || a1 < 1000 || a1 > 20000) {
			alert('请输入有效的最大宽度 (1000-20000)');
			this.value = eeee57;
			return;
		}
		
		eeee57 = a1;
		
		const b2 = nnnnn92();
		ffff58 = tttt72(cccc55, dddd56, b2);
		
		const c3 = uuuu73(cccc55, ffff58, dddd56);
		
		if (!c3.isValid) {
			wwww75(c3.width);
		} else {
			xxxx76();
		}
		
		sssss97();
	});
	
	// 压缩滑块事件
	uuu47.addEventListener('input', function() {
		const a1 = parseInt(this.value);
		gggg59 = a1 / 100;
		vvv48.textContent = `${a1}%`;
		
		// 更新预设按钮状态
		document.querySelectorAll('.d0-38').forEach(btn => {
			btn.classList.remove('e1-39');
		});
	});
	
	// 压缩预设按钮事件
	document.querySelectorAll('.d0-38').forEach(btn => {
		btn.addEventListener('click', function() {
			const a1 = parseInt(this.getAttribute('data-quality'));
			
			// 更新滑块和值
			uuu47.value = a1;
			gggg59 = a1 / 100;
			vvv48.textContent = `${a1}%`;
			
			// 更新按钮状态
			document.querySelectorAll('.d0-38').forEach(b => {
				b.classList.remove('e1-39');
			});
			this.classList.add('e1-39');
		});
	});
	
	// 输入框按回车键提交
	dd4.addEventListener('keyup', function(event) {
		if (event.key === 'Enter') hh8.click();
	});
	
	ee5.addEventListener('keyup', function(event) {
		if (event.key === 'Enter') hh8.click();
	});
	
	ff6.addEventListener('keyup', function(event) {
		if (event.key === 'Enter') hh8.click();
	});
	
	gg7.addEventListener('keyup', function(event) {
		if (event.key === 'Enter') hh8.click();
	});
	
	// 实时预览功能 - 同时应用行和列
	let iiii113;
	[dd4, ee5, ff6].forEach(input => {
		input.addEventListener('input', function() {
			clearTimeout(iiii113);
			
			iiii113 = setTimeout(() => {
				const a1 = parseInt(dd4.value);
				const b2 = parseInt(ee5.value);
				const c3 = parseInt(ff6.value);
				
				if (!isNaN(a1) && a1 >= 1 && a1 <= 100 &&
					!isNaN(b2) && b2 >= 1 && b2 <= 100 &&
					!isNaN(c3) && c3 >= 0 && c3 <= 200) {
					
					const d4 = nnnnn92();
					const e5 = tttt72(b2, c3, d4);
					
					const f6 = uuuu73(b2, e5, c3);
					
					if (!f6.isValid) {
						wwww75(f6.width);
					} else {
						xxxx76();
					}
					
					// 实时更新网格布局（行和列）
					kk11.style.gridTemplateColumns = `repeat(${b2}, ${xxx50}px)`;
					kk11.style.gridTemplateRows = `repeat(${a1}, ${xxx50}px)`;
					const g7 = qqqq69(xxx50, c3);
					kk11.style.gap = `${g7}px`;
					
					ll12.textContent = a1;
					mm13.textContent = b2;
					nn14.textContent = c3;
					
					const h8 = a1 * b2;
					const i9 = aa1.length;
					oo15.textContent = i9;
					
					const j10 = qqqq69(e5, c3);
					const k11 = rrrr70(b2, e5, c3);
					const l12 = ssss71(a1, e5, c3);
					tt20.textContent = `${Math.round(k11)}×${Math.round(l12)}px`;
					uu21.textContent = `${Math.round(e5)}px`;
					
					vvvv74(b2, e5, c3);
				}
			}, 300);
		});
	});
	
	// 多图拖拽区域事件
	// 拖拽经过
	rrr44.addEventListener('dragover', function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		if (!jjjj62 && e.dataTransfer.types.includes('Files')) {
			this.classList.add('def-2');
			e.dataTransfer.dropEffect = 'copy';
		}
	});
	
	// 拖拽离开
	rrr44.addEventListener('dragleave', function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		const a1 = this.getBoundingClientRect();
		const b2 = e.clientX;
		const c3 = e.clientY;
		
		if (b2 >= a1.left && b2 <= a1.right && c3 >= a1.top && c3 <= a1.bottom) {
			return;
		}
		
		this.classList.remove('def-2');
	});
	
	// 拖拽放置
	rrr44.addEventListener('drop', function(e) {
		e.preventDefault();
		e.stopPropagation();
		
		// 处理多图拖拽区域的文件
		const a1 = e.dataTransfer.files;
		if (a1.length > 0) {
			bbbbbb106(a1);
		}
		
		this.classList.remove('def-2');
	});
	
	// 多图拖拽区域点击事件
	rrr44.addEventListener('click', function(e) {
		// 防止点击按钮时触发区域点击事件
		if (e.target.closest('.m9-47')) {
			return;
		}
		
		// 创建文件输入元素
		const a1 = document.createElement('input');
		a1.type = 'file';
		a1.accept = 'image/*';
		a1.multiple = true; // 允许多选
		a1.style.display = 'none';
		
		a1.onchange = (e) => {
			const b2 = e.target.files;
			if (b2.length > 0) {
				bbbbbb106(b2);
			}
		};
		
		document.body.appendChild(a1);
		a1.click();
		document.body.removeChild(a1);
	});
	
	// 多图选择按钮点击事件
	sss45.addEventListener('click', function(e) {
		e.stopPropagation(); // 阻止事件冒泡到父元素
		
		// 创建文件输入元素
		const a1 = document.createElement('input');
		a1.type = 'file';
		a1.accept = 'image/*';
		a1.multiple = true; // 允许多选
		a1.style.display = 'none';
		
		a1.onchange = (e) => {
			const b2 = e.target.files;
			if (b2.length > 0) {
				bbbbbb106(b2);
			}
		};
		
		document.body.appendChild(a1);
		a1.click();
		document.body.removeChild(a1);
	});
	
	// 阻止body的默认拖拽行为
	document.body.addEventListener('dragover', function(e) {
		e.preventDefault();
		e.stopPropagation();
	});
	
	document.body.addEventListener('drop', function(e) {
		e.preventDefault();
		e.stopPropagation();
	});
}

// 初始加载
ppppp94();
hhhhhh112();