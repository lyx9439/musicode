var CryptoJS = (function(u, p) {
	var d = {},
		l = (d.lib = {}),
		s = function() {},
		t = (l.Base = {
			extend: function(a) {
				s.prototype = this;
				var c = new s();
				a && c.mixIn(a);
				c.hasOwnProperty('init') ||
					(c.init = function() {
						c.$super.init.apply(this, arguments);
					});
				c.init.prototype = c;
				c.$super = this;
				return c;
			},
			create: function() {
				var a = this.extend();
				a.init.apply(a, arguments);
				return a;
			},
			init: function() {},
			mixIn: function(a) {
				for (var c in a) a.hasOwnProperty(c) && (this[c] = a[c]);
				a.hasOwnProperty('toString') && (this.toString = a.toString);
			},
			clone: function() {
				return this.init.prototype.extend(this);
			}
		}),
		r = (l.WordArray = t.extend({
			init: function(a, c) {
				a = this.words = a || [];
				this.sigBytes = c != p ? c : 4 * a.length;
			},
			toString: function(a) {
				return (a || v).stringify(this);
			},
			concat: function(a) {
				var c = this.words,
					e = a.words,
					j = this.sigBytes;
				a = a.sigBytes;
				this.clamp();
				if (j % 4)
					for (var k = 0; k < a; k++)
						c[(j + k) >>> 2] |= ((e[k >>> 2] >>> (24 - 8 * (k % 4))) & 255) << (24 - 8 * ((j + k) % 4));
				else if (65535 < e.length) for (k = 0; k < a; k += 4) c[(j + k) >>> 2] = e[k >>> 2];
				else c.push.apply(c, e);
				this.sigBytes += a;
				return this;
			},
			clamp: function() {
				var a = this.words,
					c = this.sigBytes;
				a[c >>> 2] &= 4294967295 << (32 - 8 * (c % 4));
				a.length = u.ceil(c / 4);
			},
			clone: function() {
				var a = t.clone.call(this);
				a.words = this.words.slice(0);
				return a;
			},
			random: function(a) {
				for (var c = [], e = 0; e < a; e += 4) c.push((4294967296 * u.random()) | 0);
				return new r.init(c, a);
			}
		})),
		w = (d.enc = {}),
		v = (w.Hex = {
			stringify: function(a) {
				var c = a.words;
				a = a.sigBytes;
				for (var e = [], j = 0; j < a; j++) {
					var k = (c[j >>> 2] >>> (24 - 8 * (j % 4))) & 255;
					e.push((k >>> 4).toString(16));
					e.push((k & 15).toString(16));
				}
				return e.join('');
			},
			parse: function(a) {
				for (var c = a.length, e = [], j = 0; j < c; j += 2)
					e[j >>> 3] |= parseInt(a.substr(j, 2), 16) << (24 - 4 * (j % 8));
				return new r.init(e, c / 2);
			}
		}),
		b = (w.Latin1 = {
			stringify: function(a) {
				var c = a.words;
				a = a.sigBytes;
				for (var e = [], j = 0; j < a; j++)
					e.push(String.fromCharCode((c[j >>> 2] >>> (24 - 8 * (j % 4))) & 255));
				return e.join('');
			},
			parse: function(a) {
				for (var c = a.length, e = [], j = 0; j < c; j++)
					e[j >>> 2] |= (a.charCodeAt(j) & 255) << (24 - 8 * (j % 4));
				return new r.init(e, c);
			}
		}),
		x = (w.Utf8 = {
			stringify: function(a) {
				try {
					return decodeURIComponent(escape(b.stringify(a)));
				} catch (c) {
					throw Error('Malformed UTF-8 data');
				}
			},
			parse: function(a) {
				return b.parse(unescape(encodeURIComponent(a)));
			}
		}),
		q = (l.BufferedBlockAlgorithm = t.extend({
			reset: function() {
				this.i7b = new r.init();
				this.oa2x = 0;
			},
			rw3x: function(a) {
				'string' == typeof a && (a = x.parse(a));
				this.i7b.concat(a);
				this.oa2x += a.sigBytes;
			},
			gN0x: function(a) {
				var c = this.i7b,
					e = c.words,
					j = c.sigBytes,
					k = this.blockSize,
					b = j / (4 * k),
					b = a ? u.ceil(b) : u.max((b | 0) - this.El7e, 0);
				a = b * k;
				j = u.min(4 * a, j);
				if (a) {
					for (var q = 0; q < a; q += k) this.kT1x(e, q);
					q = e.splice(0, a);
					c.sigBytes -= j;
				}
				return new r.init(q, j);
			},
			clone: function() {
				var a = t.clone.call(this);
				a.i7b = this.i7b.clone();
				return a;
			},
			El7e: 0
		}));
	l.Hasher = q.extend({
		cfg: t.extend(),
		init: function(a) {
			this.cfg = this.cfg.extend(a);
			this.reset();
		},
		reset: function() {
			q.reset.call(this);
			this.hu0x();
		},
		update: function(a) {
			this.rw3x(a);
			this.gN0x();
			return this;
		},
		finalize: function(a) {
			a && this.rw3x(a);
			return this.iP0x();
		},
		blockSize: 16,
		hH0x: function(a) {
			return function(b, e) {
				return new a.init(e).finalize(b);
			};
		},
		nw2x: function(a) {
			return function(b, e) {
				return new n.HMAC.init(a, e).finalize(b);
			};
		}
	});
	var n = (d.algo = {});
	return d;
})(Math);

(function() {
	var u = CryptoJS,
		p = u.lib.WordArray;
	u.enc.Base64 = {
		stringify: function(d) {
			var l = d.words,
				p = d.sigBytes,
				t = this.bA7t;
			d.clamp();
			d = [];
			for (var r = 0; r < p; r += 3)
				for (
					var w =
							(((l[r >>> 2] >>> (24 - 8 * (r % 4))) & 255) << 16) |
							(((l[(r + 1) >>> 2] >>> (24 - 8 * ((r + 1) % 4))) & 255) << 8) |
							((l[(r + 2) >>> 2] >>> (24 - 8 * ((r + 2) % 4))) & 255),
						v = 0;
					4 > v && r + 0.75 * v < p;
					v++
				)
					d.push(t.charAt((w >>> (6 * (3 - v))) & 63));
			if ((l = t.charAt(64))) for (; d.length % 4; ) d.push(l);
			return d.join('');
		},
		parse: function(d) {
			var l = d.length,
				s = this.bA7t,
				t = s.charAt(64);
			t && ((t = d.indexOf(t)), -1 != t && (l = t));
			for (var t = [], r = 0, w = 0; w < l; w++)
				if (w % 4) {
					var v = s.indexOf(d.charAt(w - 1)) << (2 * (w % 4)),
						b = s.indexOf(d.charAt(w)) >>> (6 - 2 * (w % 4));
					t[r >>> 2] |= (v | b) << (24 - 8 * (r % 4));
					r++;
				}
			return p.create(t, r);
		},
		bA7t: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='
	};
})();

CryptoJS.lib.Cipher ||
	(function(u) {
		var p = CryptoJS,
			d = p.lib,
			l = d.Base,
			s = d.WordArray,
			t = d.BufferedBlockAlgorithm,
			r = p.enc.Base64,
			w = p.algo.EvpKDF,
			v = (d.Cipher = t.extend({
				cfg: l.extend(),
				createEncryptor: function(e, a) {
					return this.create(this.wS5X, e, a);
				},
				createDecryptor: function(e, a) {
					return this.create(this.VD4H, e, a);
				},
				init: function(e, a, b) {
					this.cfg = this.cfg.extend(b);
					this.Eh7a = e;
					this.K7D = a;
					this.reset();
				},
				reset: function() {
					t.reset.call(this);
					this.hu0x();
				},
				process: function(e) {
					this.rw3x(e);
					return this.gN0x();
				},
				finalize: function(e) {
					e && this.rw3x(e);
					return this.iP0x();
				},
				keySize: 4,
				ivSize: 4,
				wS5X: 1,
				VD4H: 2,
				hH0x: function(e) {
					return {
						encrypt: function(b, k, d) {
							return ('string' == typeof k ? c : a).encrypt(e, b, k, d);
						},
						decrypt: function(b, k, d) {
							return ('string' == typeof k ? c : a).decrypt(e, b, k, d);
						}
					};
				}
			}));
		d.StreamCipher = v.extend({
			iP0x: function() {
				return this.gN0x(!0);
			},
			blockSize: 1
		});
		var b = (p.mode = {}),
			x = function(e, a, b) {
				var c = this.kO1x;
				c ? (this.kO1x = u) : (c = this.sh3x);
				for (var d = 0; d < b; d++) e[a + d] ^= c[d];
			},
			q = (d.BlockCipherMode = l.extend({
				createEncryptor: function(e, a) {
					return this.Encryptor.create(e, a);
				},
				createDecryptor: function(e, a) {
					return this.Decryptor.create(e, a);
				},
				init: function(e, a) {
					this.lX1x = e;
					this.kO1x = a;
				}
			})).extend();
		q.Encryptor = q.extend({
			processBlock: function(e, a) {
				var b = this.lX1x,
					c = b.blockSize;
				x.call(this, e, a, c);
				b.encryptBlock(e, a);
				this.sh3x = e.slice(a, a + c);
			}
		});
		q.Decryptor = q.extend({
			processBlock: function(e, a) {
				var b = this.lX1x,
					c = b.blockSize,
					d = e.slice(a, a + c);
				b.decryptBlock(e, a);
				x.call(this, e, a, c);
				this.sh3x = d;
			}
		});
		b = b.CBC = q;
		q = (p.pad = {}).Pkcs7 = {
			pad: function(a, b) {
				for (
					var c = 4 * b, c = c - a.sigBytes % c, d = (c << 24) | (c << 16) | (c << 8) | c, l = [], n = 0;
					n < c;
					n += 4
				)
					l.push(d);
				c = s.create(l, c);
				a.concat(c);
			},
			unpad: function(a) {
				a.sigBytes -= a.words[(a.sigBytes - 1) >>> 2] & 255;
			}
		};
		d.BlockCipher = v.extend({
			cfg: v.cfg.extend({
				mode: b,
				padding: q
			}),
			reset: function() {
				v.reset.call(this);
				var a = this.cfg,
					b = a.iv,
					a = a.mode;
				if (this.Eh7a == this.wS5X) var c = a.createEncryptor;
				else (c = a.createDecryptor), (this.El7e = 1);
				this.eu9l = c.call(a, this, b && b.words);
			},
			kT1x: function(a, b) {
				this.eu9l.processBlock(a, b);
			},
			iP0x: function() {
				var a = this.cfg.padding;
				if (this.Eh7a == this.wS5X) {
					a.pad(this.i7b, this.blockSize);
					var b = this.gN0x(!0);
				} else (b = this.gN0x(!0)), a.unpad(b);
				return b;
			},
			blockSize: 4
		});
		var n = (d.CipherParams = l.extend({
				init: function(a) {
					this.mixIn(a);
				},
				toString: function(a) {
					return (a || this.formatter).stringify(this);
				}
			})),
			b = ((p.format = {}).OpenSSL = {
				stringify: function(a) {
					var b = a.ciphertext;
					a = a.salt;
					return (a ? s.create([ 1398893684, 1701076831 ]).concat(a).concat(b) : b).toString(r);
				},
				parse: function(a) {
					a = r.parse(a);
					var b = a.words;
					if (1398893684 == b[0] && 1701076831 == b[1]) {
						var c = s.create(b.slice(2, 4));
						b.splice(0, 4);
						a.sigBytes -= 16;
					}
					return n.create({
						ciphertext: a,
						salt: c
					});
				}
			}),
			a = (d.SerializableCipher = l.extend({
				cfg: l.extend({
					format: b
				}),
				encrypt: function(a, b, c, d) {
					d = this.cfg.extend(d);
					var l = a.createEncryptor(c, d);
					b = l.finalize(b);
					l = l.cfg;
					return n.create({
						ciphertext: b,
						key: c,
						iv: l.iv,
						algorithm: a,
						mode: l.mode,
						padding: l.padding,
						blockSize: a.blockSize,
						formatter: d.format
					});
				},
				decrypt: function(a, b, c, d) {
					d = this.cfg.extend(d);
					b = this.xY5d(b, d.format);
					return a.createDecryptor(c, d).finalize(b.ciphertext);
				},
				xY5d: function(a, b) {
					return 'string' == typeof a ? b.parse(a, this) : a;
				}
			})),
			p = ((p.kdf = {}).OpenSSL = {
				execute: function(a, b, c, d) {
					d || (d = s.random(8));
					a = w
						.create({
							keySize: b + c
						})
						.compute(a, d);
					c = s.create(a.words.slice(b), 4 * c);
					a.sigBytes = 4 * b;
					return n.create({
						key: a,
						iv: c,
						salt: d
					});
				}
			}),
			c = (d.PasswordBasedCipher = a.extend({
				cfg: a.cfg.extend({
					kdf: p
				}),
				encrypt: function(b, c, d, l) {
					l = this.cfg.extend(l);
					d = l.kdf.execute(d, b.keySize, b.ivSize);
					l.iv = d.iv;
					b = a.encrypt.call(this, b, c, d.key, l);
					b.mixIn(d);
					return b;
				},
				decrypt: function(b, c, d, l) {
					l = this.cfg.extend(l);
					c = this.xY5d(c, l.format);
					d = l.kdf.execute(d, b.keySize, b.ivSize, c.salt);
					l.iv = d.iv;
					return a.decrypt.call(this, b, c, d.key, l);
				}
			}));
	})();
(function() {
	for (
		var u = CryptoJS,
			p = u.lib.BlockCipher,
			d = u.algo,
			l = [],
			s = [],
			t = [],
			r = [],
			w = [],
			v = [],
			b = [],
			x = [],
			q = [],
			n = [],
			a = [],
			c = 0;
		256 > c;
		c++
	)
		a[c] = 128 > c ? c << 1 : (c << 1) ^ 283;
	for (var e = 0, j = 0, c = 0; 256 > c; c++) {
		var k = j ^ (j << 1) ^ (j << 2) ^ (j << 3) ^ (j << 4),
			k = (k >>> 8) ^ (k & 255) ^ 99;
		l[e] = k;
		s[k] = e;
		var z = a[e],
			F = a[z],
			G = a[F],
			y = (257 * a[k]) ^ (16843008 * k);
		t[e] = (y << 24) | (y >>> 8);
		r[e] = (y << 16) | (y >>> 16);
		w[e] = (y << 8) | (y >>> 24);
		v[e] = y;
		y = (16843009 * G) ^ (65537 * F) ^ (257 * z) ^ (16843008 * e);
		b[k] = (y << 24) | (y >>> 8);
		x[k] = (y << 16) | (y >>> 16);
		q[k] = (y << 8) | (y >>> 24);
		n[k] = y;
		e ? ((e = z ^ a[a[a[G ^ z]]]), (j ^= a[a[j]])) : (e = j = 1);
	}
	var H = [ 0, 1, 2, 4, 8, 16, 32, 64, 128, 27, 54 ],
		d = (d.AES = p.extend({
			hu0x: function() {
				for (
					var a = this.K7D,
						c = a.words,
						d = a.sigBytes / 4,
						a = 4 * ((this.GA8s = d + 6) + 1),
						e = (this.VE4I = []),
						j = 0;
					j < a;
					j++
				)
					if (j < d) e[j] = c[j];
					else {
						var k = e[j - 1];
						j % d
							? 6 < d &&
								4 == j % d &&
								(k =
									(l[k >>> 24] << 24) |
									(l[(k >>> 16) & 255] << 16) |
									(l[(k >>> 8) & 255] << 8) |
									l[k & 255])
							: ((k = (k << 8) | (k >>> 24)),
								(k =
									(l[k >>> 24] << 24) |
									(l[(k >>> 16) & 255] << 16) |
									(l[(k >>> 8) & 255] << 8) |
									l[k & 255]),
								(k ^= H[(j / d) | 0] << 24));
						e[j] = e[j - d] ^ k;
					}
				c = this.VJ4N = [];
				for (d = 0; d < a; d++)
					(j = a - d),
						(k = d % 4 ? e[j] : e[j - 4]),
						(c[d] =
							4 > d || 4 >= j
								? k
								: b[l[k >>> 24]] ^ x[l[(k >>> 16) & 255]] ^ q[l[(k >>> 8) & 255]] ^ n[l[k & 255]]);
			},
			encryptBlock: function(a, b) {
				this.sj3x(a, b, this.VE4I, t, r, w, v, l);
			},
			decryptBlock: function(a, c) {
				var d = a[c + 1];
				a[c + 1] = a[c + 3];
				a[c + 3] = d;
				this.sj3x(a, c, this.VJ4N, b, x, q, n, s);
				d = a[c + 1];
				a[c + 1] = a[c + 3];
				a[c + 3] = d;
			},
			sj3x: function(a, b, c, d, e, j, l, f) {
				for (
					var m = this.GA8s,
						g = a[b] ^ c[0],
						h = a[b + 1] ^ c[1],
						k = a[b + 2] ^ c[2],
						n = a[b + 3] ^ c[3],
						p = 4,
						r = 1;
					r < m;
					r++
				)
					var q = d[g >>> 24] ^ e[(h >>> 16) & 255] ^ j[(k >>> 8) & 255] ^ l[n & 255] ^ c[p++],
						s = d[h >>> 24] ^ e[(k >>> 16) & 255] ^ j[(n >>> 8) & 255] ^ l[g & 255] ^ c[p++],
						t = d[k >>> 24] ^ e[(n >>> 16) & 255] ^ j[(g >>> 8) & 255] ^ l[h & 255] ^ c[p++],
						n = d[n >>> 24] ^ e[(g >>> 16) & 255] ^ j[(h >>> 8) & 255] ^ l[k & 255] ^ c[p++],
						g = q,
						h = s,
						k = t;
				q =
					((f[g >>> 24] << 24) | (f[(h >>> 16) & 255] << 16) | (f[(k >>> 8) & 255] << 8) | f[n & 255]) ^
					c[p++];
				s =
					((f[h >>> 24] << 24) | (f[(k >>> 16) & 255] << 16) | (f[(n >>> 8) & 255] << 8) | f[g & 255]) ^
					c[p++];
				t =
					((f[k >>> 24] << 24) | (f[(n >>> 16) & 255] << 16) | (f[(g >>> 8) & 255] << 8) | f[h & 255]) ^
					c[p++];
				n =
					((f[n >>> 24] << 24) | (f[(g >>> 16) & 255] << 16) | (f[(h >>> 8) & 255] << 8) | f[k & 255]) ^
					c[p++];
				a[b] = q;
				a[b + 1] = s;
				a[b + 2] = t;
				a[b + 3] = n;
			},
			keySize: 8
		}));
	u.AES = p.hH0x(d);
})();

function RSAKeyPair(a, b, c) {
	(this.e = biFromHex(a)),
		(this.d = biFromHex(b)),
		(this.m = biFromHex(c)),
		(this.chunkSize = 2 * biHighIndex(this.m)),
		(this.radix = 16),
		(this.barrett = new BarrettMu(this.m));
}
function twoDigit(a) {
	return (10 > a ? '0' : '') + String(a);
}
function encryptedString(a, b) {
	for (var f, g, h, i, j, k, l, c = new Array(), d = b.length, e = 0; d > e; ) (c[e] = b.charCodeAt(e)), e++;
	for (; 0 != c.length % a.chunkSize; ) c[e++] = 0;
	for (f = c.length, g = '', e = 0; f > e; e += a.chunkSize) {
		for (j = new BigInt(), h = 0, i = e; i < e + a.chunkSize; ++h)
			(j.digits[h] = c[i++]), (j.digits[h] += c[i++] << 8);
		(k = a.barrett.powMod(j, a.e)), (l = 16 == a.radix ? biToHex(k) : biToString(k, a.radix)), (g += l + ' ');
	}
	return g.substring(0, g.length - 1);
}
function decryptedString(a, b) {
	var e,
		f,
		g,
		h,
		c = b.split(' '),
		d = '';
	for (e = 0; e < c.length; ++e)
		for (
			h = 16 == a.radix ? biFromHex(c[e]) : biFromString(c[e], a.radix), g = a.barrett.powMod(h, a.d), f = 0;
			f <= biHighIndex(g);
			++f
		)
			d += String.fromCharCode(255 & g.digits[f], g.digits[f] >> 8);
	return 0 == d.charCodeAt(d.length - 1) && (d = d.substring(0, d.length - 1)), d;
}
function setMaxDigits(a) {
	(maxDigits = a), (ZERO_ARRAY = new Array(maxDigits));
	for (var b = 0; b < ZERO_ARRAY.length; b++) ZERO_ARRAY[b] = 0;
	(bigZero = new BigInt()), (bigOne = new BigInt()), (bigOne.digits[0] = 1);
}
function BigInt(a) {
	(this.digits = 'boolean' == typeof a && 1 == a ? null : ZERO_ARRAY.slice(0)), (this.isNeg = !1);
}
function biFromDecimal(a) {
	for (var d, e, f, b = '-' == a.charAt(0), c = b ? 1 : 0; c < a.length && '0' == a.charAt(c); ) ++c;
	if (c == a.length) d = new BigInt();
	else {
		for (
			e = a.length - c, f = e % dpl10, 0 == f && (f = dpl10), d = biFromNumber(Number(a.substr(c, f))), c += f;
			c < a.length;

		)
			(d = biAdd(biMultiply(d, lr10), biFromNumber(Number(a.substr(c, dpl10))))), (c += dpl10);
		d.isNeg = b;
	}
	return d;
}
function biCopy(a) {
	var b = new BigInt(!0);
	return (b.digits = a.digits.slice(0)), (b.isNeg = a.isNeg), b;
}
function biFromNumber(a) {
	var c,
		b = new BigInt();
	for (b.isNeg = 0 > a, a = Math.abs(a), c = 0; a > 0; ) (b.digits[c++] = a & maxDigitVal), (a >>= biRadixBits);
	return b;
}
function reverseStr(a) {
	var c,
		b = '';
	for (c = a.length - 1; c > -1; --c) b += a.charAt(c);
	return b;
}
function biToString(a, b) {
	var d,
		e,
		c = new BigInt();
	for (
		c.digits[0] = b, d = biDivideModulo(a, c), e = hexatrigesimalToChar[d[1].digits[0]];
		1 == biCompare(d[0], bigZero);

	)
		(d = biDivideModulo(d[0], c)), (digit = d[1].digits[0]), (e += hexatrigesimalToChar[d[1].digits[0]]);
	return (a.isNeg ? '-' : '') + reverseStr(e);
}
function biToDecimal(a) {
	var c,
		d,
		b = new BigInt();
	for (b.digits[0] = 10, c = biDivideModulo(a, b), d = String(c[1].digits[0]); 1 == biCompare(c[0], bigZero); )
		(c = biDivideModulo(c[0], b)), (d += String(c[1].digits[0]));
	return (a.isNeg ? '-' : '') + reverseStr(d);
}
function digitToHex(a) {
	var b = 15,
		c = '';
	for (var i = 0; 4 > i; ++i) (c += hexToChar[a & b]), (a >>>= 4);
	return reverseStr(c);
}
function biToHex(a) {
	var d,
		b = '';
	for (biHighIndex(a), d = biHighIndex(a); d > -1; --d) b += digitToHex(a.digits[d]);
	return b;
}
function charToHex(a) {
	var h,
		b = 48,
		c = b + 9,
		d = 97,
		e = d + 25,
		f = 65,
		g = 90;
	return (h = a >= b && c >= a ? a - b : a >= f && g >= a ? 10 + a - f : a >= d && e >= a ? 10 + a - d : 0);
}
function hexToDigit(a) {
	var d,
		b = 0,
		c = Math.min(a.length, 4);
	for (d = 0; c > d; ++d) (b <<= 4), (b |= charToHex(a.charCodeAt(d)));
	return b;
}
function biFromHex(a) {
	var d,
		e,
		b = new BigInt(),
		c = a.length;
	for (d = c, e = 0; d > 0; d -= 4, ++e) b.digits[e] = hexToDigit(a.substr(Math.max(d - 4, 0), Math.min(d, 4)));
	return b;
}
function biFromString(a, b) {
	var g,
		h,
		i,
		j,
		c = '-' == a.charAt(0),
		d = c ? 1 : 0,
		e = new BigInt(),
		f = new BigInt();
	for (f.digits[0] = 1, g = a.length - 1; g >= d; g--)
		(h = a.charCodeAt(g)),
			(i = charToHex(h)),
			(j = biMultiplyDigit(f, i)),
			(e = biAdd(e, j)),
			(f = biMultiplyDigit(f, b));
	return (e.isNeg = c), e;
}
function biDump(a) {
	return (a.isNeg ? '-' : '') + a.digits.join(' ');
}
function biAdd(a, b) {
	var c, d, e, f;
	if (a.isNeg != b.isNeg) (b.isNeg = !b.isNeg), (c = biSubtract(a, b)), (b.isNeg = !b.isNeg);
	else {
		for (c = new BigInt(), d = 0, f = 0; f < a.digits.length; ++f)
			(e = a.digits[f] + b.digits[f] + d), (c.digits[f] = 65535 & e), (d = Number(e >= biRadix));
		c.isNeg = a.isNeg;
	}
	return c;
}
function biSubtract(a, b) {
	var c, d, e, f;
	if (a.isNeg != b.isNeg) (b.isNeg = !b.isNeg), (c = biAdd(a, b)), (b.isNeg = !b.isNeg);
	else {
		for (c = new BigInt(), e = 0, f = 0; f < a.digits.length; ++f)
			(d = a.digits[f] - b.digits[f] + e),
				(c.digits[f] = 65535 & d),
				c.digits[f] < 0 && (c.digits[f] += biRadix),
				(e = 0 - Number(0 > d));
		if (-1 == e) {
			for (e = 0, f = 0; f < a.digits.length; ++f)
				(d = 0 - c.digits[f] + e),
					(c.digits[f] = 65535 & d),
					c.digits[f] < 0 && (c.digits[f] += biRadix),
					(e = 0 - Number(0 > d));
			c.isNeg = !a.isNeg;
		} else c.isNeg = a.isNeg;
	}
	return c;
}
function biHighIndex(a) {
	for (var b = a.digits.length - 1; b > 0 && 0 == a.digits[b]; ) --b;
	return b;
}
function biNumBits(a) {
	var e,
		b = biHighIndex(a),
		c = a.digits[b],
		d = (b + 1) * bitsPerDigit;
	for (e = d; e > d - bitsPerDigit && 0 == (32768 & c); --e) c <<= 1;
	return e;
}
function biMultiply(a, b) {
	var d,
		h,
		i,
		k,
		c = new BigInt(),
		e = biHighIndex(a),
		f = biHighIndex(b);
	for (k = 0; f >= k; ++k) {
		for (var d = 0, i = k, j = 0; e >= j; ++j, ++i)
			(h = c.digits[i] + a.digits[j] * b.digits[k] + d), (c.digits[i] = h & maxDigitVal), (d = h >>> biRadixBits);
		c.digits[k + e + 1] = d;
	}
	return (c.isNeg = a.isNeg != b.isNeg), c;
}
function biMultiplyDigit(a, b) {
	var c, d, e, f;
	for (var result = new BigInt(), c = biHighIndex(a), d = 0, f = 0; c >= f; ++f)
		(e = result.digits[f] + a.digits[f] * b + d), (result.digits[f] = e & maxDigitVal), (d = e >>> biRadixBits);
	return (result.digits[1 + c] = d), result;
}
function arrayCopy(a, b, c, d, e) {
	var g,
		h,
		f = Math.min(b + e, a.length);
	for (g = b, h = d; f > g; ++g, ++h) c[h] = a[g];
}
function biShiftLeft(a, b) {
	var e,
		f,
		g,
		h,
		c = Math.floor(b / bitsPerDigit),
		d = new BigInt();
	for (
		arrayCopy(a.digits, 0, d.digits, c, d.digits.length - c),
			e = b % bitsPerDigit,
			f = bitsPerDigit - e,
			g = d.digits.length - 1,
			h = g - 1;
		g > 0;
		--g, --h
	)
		d.digits[g] = ((d.digits[g] << e) & maxDigitVal) | ((d.digits[h] & highBitMasks[e]) >>> f);
	return (d.digits[0] = (d.digits[g] << e) & maxDigitVal), (d.isNeg = a.isNeg), d;
}
function biShiftRight(a, b) {
	var e,
		f,
		g,
		h,
		c = Math.floor(b / bitsPerDigit),
		d = new BigInt();
	for (
		arrayCopy(a.digits, c, d.digits, 0, a.digits.length - c),
			e = b % bitsPerDigit,
			f = bitsPerDigit - e,
			g = 0,
			h = g + 1;
		g < d.digits.length - 1;
		++g, ++h
	)
		d.digits[g] = (d.digits[g] >>> e) | ((d.digits[h] & lowBitMasks[e]) << f);
	return (d.digits[d.digits.length - 1] >>>= e), (d.isNeg = a.isNeg), d;
}
function biMultiplyByRadixPower(a, b) {
	var c = new BigInt();
	return arrayCopy(a.digits, 0, c.digits, b, c.digits.length - b), c;
}
function biDivideByRadixPower(a, b) {
	var c = new BigInt();
	return arrayCopy(a.digits, b, c.digits, 0, c.digits.length - b), c;
}
function biModuloByRadixPower(a, b) {
	var c = new BigInt();
	return arrayCopy(a.digits, 0, c.digits, 0, b), c;
}
function biCompare(a, b) {
	if (a.isNeg != b.isNeg) return 1 - 2 * Number(a.isNeg);
	for (var c = a.digits.length - 1; c >= 0; --c)
		if (a.digits[c] != b.digits[c])
			return a.isNeg ? 1 - 2 * Number(a.digits[c] > b.digits[c]) : 1 - 2 * Number(a.digits[c] < b.digits[c]);
	return 0;
}
function biDivideModulo(a, b) {
	var f,
		g,
		h,
		i,
		j,
		k,
		l,
		m,
		n,
		o,
		p,
		q,
		r,
		s,
		c = biNumBits(a),
		d = biNumBits(b),
		e = b.isNeg;
	if (d > c)
		return (
			a.isNeg
				? ((f = biCopy(bigOne)),
					(f.isNeg = !b.isNeg),
					(a.isNeg = !1),
					(b.isNeg = !1),
					(g = biSubtract(b, a)),
					(a.isNeg = !0),
					(b.isNeg = e))
				: ((f = new BigInt()), (g = biCopy(a))),
			new Array(f, g)
		);
	for (f = new BigInt(), g = a, h = Math.ceil(d / bitsPerDigit) - 1, i = 0; b.digits[h] < biHalfRadix; )
		(b = biShiftLeft(b, 1)), ++i, ++d, (h = Math.ceil(d / bitsPerDigit) - 1);
	for (
		g = biShiftLeft(g, i), c += i, j = Math.ceil(c / bitsPerDigit) - 1, k = biMultiplyByRadixPower(b, j - h);
		-1 != biCompare(g, k);

	)
		++f.digits[j - h], (g = biSubtract(g, k));
	for (l = j; l > h; --l) {
		for (
			m = l >= g.digits.length ? 0 : g.digits[l],
				n = l - 1 >= g.digits.length ? 0 : g.digits[l - 1],
				o = l - 2 >= g.digits.length ? 0 : g.digits[l - 2],
				p = h >= b.digits.length ? 0 : b.digits[h],
				q = h - 1 >= b.digits.length ? 0 : b.digits[h - 1],
				f.digits[l - h - 1] = m == p ? maxDigitVal : Math.floor((m * biRadix + n) / p),
				r = f.digits[l - h - 1] * (p * biRadix + q),
				s = m * biRadixSquared + (n * biRadix + o);
			r > s;

		)
			--f.digits[l - h - 1],
				(r = f.digits[l - h - 1] * ((p * biRadix) | q)),
				(s = m * biRadix * biRadix + (n * biRadix + o));
		(k = biMultiplyByRadixPower(b, l - h - 1)),
			(g = biSubtract(g, biMultiplyDigit(k, f.digits[l - h - 1]))),
			g.isNeg && ((g = biAdd(g, k)), --f.digits[l - h - 1]);
	}
	return (
		(g = biShiftRight(g, i)),
		(f.isNeg = a.isNeg != e),
		a.isNeg &&
			((f = e ? biAdd(f, bigOne) : biSubtract(f, bigOne)), (b = biShiftRight(b, i)), (g = biSubtract(b, g))),
		0 == g.digits[0] && 0 == biHighIndex(g) && (g.isNeg = !1),
		new Array(f, g)
	);
}
function biDivide(a, b) {
	return biDivideModulo(a, b)[0];
}
function biModulo(a, b) {
	return biDivideModulo(a, b)[1];
}
function biMultiplyMod(a, b, c) {
	return biModulo(biMultiply(a, b), c);
}
function biPow(a, b) {
	for (var c = bigOne, d = a; ; ) {
		if ((0 != (1 & b) && (c = biMultiply(c, d)), (b >>= 1), 0 == b)) break;
		d = biMultiply(d, d);
	}
	return c;
}
function biPowMod(a, b, c) {
	for (var d = bigOne, e = a, f = b; ; ) {
		if (
			(0 != (1 & f.digits[0]) && (d = biMultiplyMod(d, e, c)),
			(f = biShiftRight(f, 1)),
			0 == f.digits[0] && 0 == biHighIndex(f))
		)
			break;
		e = biMultiplyMod(e, e, c);
	}
	return d;
}
function BarrettMu(a) {
	(this.modulus = biCopy(a)), (this.k = biHighIndex(this.modulus) + 1);
	var b = new BigInt();
	(b.digits[2 * this.k] = 1),
		(this.mu = biDivide(b, this.modulus)),
		(this.bkplus1 = new BigInt()),
		(this.bkplus1.digits[this.k + 1] = 1),
		(this.modulo = BarrettMu_modulo),
		(this.multiplyMod = BarrettMu_multiplyMod),
		(this.powMod = BarrettMu_powMod);
}
function BarrettMu_modulo(a) {
	var i,
		b = biDivideByRadixPower(a, this.k - 1),
		c = biMultiply(b, this.mu),
		d = biDivideByRadixPower(c, this.k + 1),
		e = biModuloByRadixPower(a, this.k + 1),
		f = biMultiply(d, this.modulus),
		g = biModuloByRadixPower(f, this.k + 1),
		h = biSubtract(e, g);
	for (h.isNeg && (h = biAdd(h, this.bkplus1)), i = biCompare(h, this.modulus) >= 0; i; )
		(h = biSubtract(h, this.modulus)), (i = biCompare(h, this.modulus) >= 0);
	return h;
}
function BarrettMu_multiplyMod(a, b) {
	var c = biMultiply(a, b);
	return this.modulo(c);
}
function BarrettMu_powMod(a, b) {
	var d,
		e,
		c = new BigInt();
	for (c.digits[0] = 1, d = a, e = b; ; ) {
		if (
			(0 != (1 & e.digits[0]) && (c = this.multiplyMod(c, d)),
			(e = biShiftRight(e, 1)),
			0 == e.digits[0] && 0 == biHighIndex(e))
		)
			break;
		d = this.multiplyMod(d, d);
	}
	return c;
}
var maxDigits,
	ZERO_ARRAY,
	bigZero,
	bigOne,
	dpl10,
	lr10,
	hexatrigesimalToChar,
	hexToChar,
	highBitMasks,
	lowBitMasks,
	biRadixBase = 2,
	biRadixBits = 16,
	bitsPerDigit = biRadixBits,
	biRadix = 65536,
	biHalfRadix = biRadix >>> 1,
	biRadixSquared = biRadix * biRadix,
	maxDigitVal = biRadix - 1,
	maxInteger = 9999999999999998;
setMaxDigits(20),
	(dpl10 = 15),
	(lr10 = biFromNumber(1e15)),
	(hexatrigesimalToChar = new Array(
		'0',
		'1',
		'2',
		'3',
		'4',
		'5',
		'6',
		'7',
		'8',
		'9',
		'a',
		'b',
		'c',
		'd',
		'e',
		'f',
		'g',
		'h',
		'i',
		'j',
		'k',
		'l',
		'm',
		'n',
		'o',
		'p',
		'q',
		'r',
		's',
		't',
		'u',
		'v',
		'w',
		'x',
		'y',
		'z'
	)),
	(hexToChar = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f')),
	(highBitMasks = new Array(
		0,
		32768,
		49152,
		57344,
		61440,
		63488,
		64512,
		65024,
		65280,
		65408,
		65472,
		65504,
		65520,
		65528,
		65532,
		65534,
		65535
	)),
	(lowBitMasks = new Array(0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535));
function a(a) {
	var d,
		e,
		b = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
		c = '';
	for (d = 0; a > d; d += 1) (e = Math.random() * b.length), (e = Math.floor(e)), (c += b.charAt(e));
	return c;
}
function b(a, b) {
	var c = CryptoJS.enc.Utf8.parse(b),
		d = CryptoJS.enc.Utf8.parse('0102030405060708'),
		e = CryptoJS.enc.Utf8.parse(a),
		f = CryptoJS.AES.encrypt(e, c, {
			iv: d,
			mode: CryptoJS.mode.CBC
		});
	return f.toString();
}
function c(a, b, c) {
	var d, e;
	return setMaxDigits(131), (d = new RSAKeyPair(b, '', c)), (e = encryptedString(d, a));
}
function d(d, e, f, g) {
	var h = {},
		i = a(16);
	return (h.encText = b(d, g)), (h.encText = b(h.encText, i)), (h.encSecKey = c(i, e, f)), h;
}
function e(a, b, d, e) {
	var f = {};
	return (f.encText = c(a + e, b, d)), f;
}
// encode ————start
function wI5N(gE0x, TN3x, Nh0x) {
	if (!gE0x) return '';
	var bv7o = [];
	for (var x in gE0x) {
		bv7o.push(encodeURIComponent(x) + '=' + (!!Nh0x ? encodeURIComponent(gE0x[x]) : gE0x[x]));
	}
	return bv7o.join(TN3x || ',');
}

function cB8t(gE0x) {
	return wI5N(gE0x, '&', !0);
}
// ————end

exports.asrsea = d;
exports.ecnonasr = e;
