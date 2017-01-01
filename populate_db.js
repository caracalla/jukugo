var fs = require('fs');
var parser = new require("xml2js").Parser({ ignoreAttrs: true });
var MongoClient = require('mongodb').MongoClient;
var mongoURL = 'mongodb://localhost:27017/jukugo';
var xmlFileName = "JMdict_e";

var grade_1_kanji = ['一','二','三','四','五','六','七','八','九','十','百','千','上','下','左','右','中','大','小','月','日','年','早','木','林','山','川','土','空','田','天','生','花','草','虫','犬','人','名','女','男','子','目','耳','口','手','足','見','音','力','気','円','入','出','立','休','先','夕','本','文','字','学','校','村','町','森','正','水','火','玉','王','石','竹','糸','貝','車','金','雨','赤','青','白']
var grade_2_kanji = ['数','多','少','万','半','形','太','細','広','長','点','丸','交','光','角','計','直','線','矢','弱','強','高','同','親','母','父','姉','兄','弟','妹','自','友','体','毛','頭','顔','首','心','時','曜','朝','昼','夜','分','週','春','夏','秋','冬','今','新','古','間','方','北','南','東','西','遠','近','前','後','内','外','場','地','国','園','谷','野','原','里','市','京','風','雪','雲','池','海','岩','星','室','戸','家','寺','通','門','道','話','言','答','声','聞','語','読','書','記','紙','画','絵','図','工','教','晴','思','考','知','才','理','算','作','元','食','肉','馬','牛','魚','鳥','羽','鳴','麦','米','茶','色','黄','黒','来','行','帰','歩','走','止','活','店','買','売','午','汽','弓','回','会','組','船','明','社','切','電','毎','合','当','台','楽','公','引','科','歌','刀','番','用','何']
var grade_3_kanji = ['丁','世','両','主','乗','予','事','仕','他','代','住','使','係','倍','全','具','写','列','助','勉','動','勝','化','区','医','去','反','取','受','号','向','君','味','命','和','品','員','商','問','坂','央','始','委','守','安','定','実','客','宮','宿','寒','対','局','屋','岸','島','州','帳','平','幸','度','庫','庭','式','役','待','急','息','悪','悲','想','意','感','所','打','投','拾','持','指','放','整','旅','族','昔','昭','暑','暗','曲','有','服','期','板','柱','根','植','業','様','横','橋','次','歯','死','氷','決','油','波','注','泳','洋','流','消','深','温','港','湖','湯','漢','炭','物','球','由','申','界','畑','病','発','登','皮','皿','相','県','真','着','短','研','礼','神','祭','福','秒','究','章','童','笛','第','筆','等','箱','級','終','緑','練','羊','美','習','者','育','苦','荷','落','葉','薬','血','表','詩','調','談','豆','負','起','路','身','転','軽','農','返','追','送','速','進','遊','運','部','都','配','酒','重','鉄','銀','開','院','陽','階','集','面','題','飲','館','駅','鼻']
var grade_4_kanji = ['不','争','付','令','以','仲','伝','位','低','例','便','信','倉','候','借','停','健','側','働','億','兆','児','共','兵','典','冷','初','別','利','刷','副','功','加','努','労','勇','包','卒','協','単','博','印','参','史','司','各','告','周','唱','喜','器','囲','固','型','堂','塩','士','変','夫','失','好','季','孫','完','官','害','察','巣','差','希','席','帯','底','府','康','建','径','徒','得','必','念','愛','成','戦','折','挙','改','救','敗','散','料','旗','昨','景','最','望','未','末','札','材','束','松','果','栄','案','梅','械','極','標','機','欠','歴','残','殺','毒','氏','民','求','治','法','泣','浅','浴','清','満','漁','灯','無','然','焼','照','熱','牧','特','産','的','省','祝','票','種','積','競','笑','管','節','粉','紀','約','結','給','続','置','老','胃','脈','腸','臣','航','良','芸','芽','英','菜','街','衣','要','覚','観','訓','試','説','課','議','象','貨','貯','費','賞','軍','輪','辞','辺','連','達','選','郡','量','録','鏡','関','陸','隊','静','順','願','類','飛','飯','養','験']
var grade_5_kanji = ['久','仏','仮','件','任','似','余','価','保','修','俵','個','備','像','再','刊','判','制','券','則','効','務','勢','厚','句','可','営','因','団','圧','在','均','基','報','境','墓','増','夢','妻','婦','容','寄','富','導','居','属','布','師','常','幹','序','弁','張','往','復','徳','志','応','快','性','恩','情','態','慣','承','技','招','授','採','接','提','損','支','政','故','敵','断','旧','易','暴','条','枝','査','格','桜','検','構','武','比','永','河','液','混','減','測','準','演','潔','災','燃','版','犯','状','独','率','現','留','略','益','眼','破','確','示','祖','禁','移','程','税','築','精','素','経','統','絶','綿','総','編','績','織','罪','群','義','耕','職','肥','能','興','舌','舎','術','衛','製','複','規','解','設','許','証','評','講','謝','識','護','豊','財','貧','責','貸','貿','賀','資','賛','質','輸','述','迷','退','逆','造','過','適','酸','鉱','銅','銭','防','限','険','際','雑','非','預','領','額','飼']
var grade_6_kanji = ['並','乱','乳','亡','仁','供','俳','値','傷','優','党','冊','処','刻','割','創','劇','勤','危','卵','厳','収','后','否','吸','呼','善','困','垂','城','域','奏','奮','姿','存','孝','宅','宇','宗','宙','宝','宣','密','寸','専','射','将','尊','就','尺','届','展','層','己','巻','幕','干','幼','庁','座','延','律','従','忘','忠','憲','我','批','担','拝','拡','捨','探','推','揮','操','敬','映','晩','暖','暮','朗','机','枚','染','株','棒','模','権','樹','欲','段','沿','泉','洗','派','済','源','潮','激','灰','熟','片','班','異','疑','痛','皇','盛','盟','看','砂','磁','私','秘','穀','穴','窓','筋','策','簡','糖','系','紅','納','純','絹','縦','縮','署','翌','聖','肺','背','胸','脳','腹','臓','臨','至','若','著','蒸','蔵','蚕','衆','裁','装','裏','補','視','覧','討','訪','訳','詞','誌','認','誕','誠','誤','論','諸','警','貴','賃','遺','郵','郷','針','鋼','閉','閣','降','陛','除','障','難','革','頂','骨']
var hiragana = ['ぁ','あ','ぃ','い','ぅ','う','ぇ','え','ぉ','お','か','が','き','ぎ','く','ぐ','け','げ','こ','ご','さ','ざ','し','じ','す','ず','せ','ぜ','そ','ぞ','た','だ','ち','ぢ','っ','つ','づ','て','で','と','ど','な','に','ぬ','ね','の','は','ば','ぱ','ひ','び','ぴ','ふ','ぶ','ぷ','へ','べ','ぺ','ほ','ぼ','ぽ','ま','み','む','め','も','ゃ','や','ゅ','ゆ','ょ','よ','ら','り','る','れ','ろ','ゎ','わ','ゐ','ゑ','を','ん','ゔ','ゕ','ゖ']
var katakana = ['ァ','ア','ィ','イ','ゥ','ウ','ェ','エ','ォ','オ','カ','ガ','キ','ギ','ク','グ','ケ','ゲ','コ','ゴ','サ','ザ','シ','ジ','ス','ズ','セ','ゼ','ソ','ゾ','タ','ダ','チ','ヂ','ッ','ツ','ヅ','テ','デ','ト','ド','ナ','ニ','ヌ','ネ','ノ','ハ','バ','パ','ヒ','ビ','ピ','フ','ブ','プ','ヘ','ベ','ペ','ホ','ボ','ポ','マ','ミ','ム','メ','モ','ャ','ヤ','ュ','ユ','ョ','ヨ','ラ','リ','ル','レ','ロ','ヮ','ワ','ヰ','ヱ','ヲ','ン','ヴ','ヵ','ヶ','ヷ','ヸ','ヹ','ヺ']
var others = ['！','＂','＃','＄','％','＆','＇','（','）','＊','＋','，','－','．','／','０','１','２','３','４','５','６','７','８','９','：','；','＜','＝','＞','？','＠','Ａ','Ｂ','Ｃ','Ｄ','Ｅ','Ｆ','Ｇ','Ｈ','Ｉ','Ｊ','Ｋ','Ｌ','Ｍ','Ｎ','Ｏ','Ｐ','Ｑ','Ｒ','Ｓ','Ｔ','Ｕ','Ｖ','Ｗ','Ｘ','Ｙ','Ｚ','［','＼','］','＾','＿','｀','ａ','ｂ','ｃ','ｄ','ｅ','ｆ','ｇ','ｈ','ｉ','ｊ','ｋ','ｌ','ｍ','ｎ','ｏ','ｐ','ｑ','ｒ','ｓ','ｔ','ｕ','ｖ','ｗ','ｘ','ｙ','ｚ','｛','｜','｝','～','｟','｠','｡','｢','｣','､','･','ｦ','ｧ','ｨ','ｩ','ｪ','ｫ','ｬ','ｭ','ｮ','ｯ','ｰ','ｱ','ｲ','ｳ','ｴ','ｵ','ｶ','ｷ','ｸ','ｹ','ｺ','ｻ','ｼ','ｽ','ｾ','ｿ','ﾀ','ﾁ','ﾂ','ﾃ','ﾄ','ﾅ','ﾆ','ﾇ','ﾈ','ﾉ','ﾊ','ﾋ','ﾌ','ﾍ','ﾎ','ﾏ','ﾐ','ﾑ','ﾒ','ﾓ','ﾔ','ﾕ','ﾖ','ﾗ','ﾘ','ﾙ','ﾚ','ﾛ','ﾜ','ﾝ','ﾞ','ﾟ']

var kana = others.concat(hiragana).concat(katakana)
var grade_1 = { kanji: grade_1_kanji, full_set: grade_1_kanji.concat(kana) }
var grade_2 = { kanji: grade_2_kanji, full_set: grade_2_kanji.concat(grade_1.full_set) }
var grade_3 = { kanji: grade_3_kanji, full_set: grade_3_kanji.concat(grade_2.full_set) }
var grade_4 = { kanji: grade_4_kanji, full_set: grade_4_kanji.concat(grade_3.full_set) }
var grade_5 = { kanji: grade_5_kanji, full_set: grade_5_kanji.concat(grade_4.full_set) }
var grade_6 = { kanji: grade_6_kanji, full_set: grade_6_kanji.concat(grade_5.full_set) }

var isGrade = function (word, grade) {
  characters = word.split('');

  // In the case of grade 1, make sure that the word actually contains a grade 1
  // kanji.  Do the same for grade 2, etc.
  if (!characters.map(function (character) { return grade.kanji.includes(character); }).includes(true)) {
    return false;
  }

  return !characters.map(function (character) {
    return grade.full_set.includes(character);
  }).includes(false)
}

var grade = function (word) {
  if (isGrade(word, grade_1)) {
    return 1;
  } else if (isGrade(word, grade_2)) {
    return 2;
  } else if (isGrade(word, grade_3)) {
    return 3;
  } else if (isGrade(word, grade_4)) {
    return 4;
  } else if (isGrade(word, grade_5)) {
    return 5;
  } else if (isGrade(word, grade_6)) {
    return 6;
  }
}

var parseKanjiElement = function (kanjiElement) {
  var writingObject = { kanji: kanjiElement.keb[0] };
  var grade_level = grade(writingObject.kanji);

  if (grade_level) { writingObject.grade = grade_level }

  if (Array.isArray(kanjiElement.ke_pri)) {
    writingObject.priority = kanjiElement.ke_pri.length;
  }
  if (Array.isArray(kanjiElement.ke_inf)) {
    writingObject.info = kanjiElement.ke_inf;
  }

  return writingObject;
};

var parseReadingElement = function (readingElement) {
  var readingObject = { kana: readingElement.reb[0] };

  if (Array.isArray(readingElement.re_pri)) {
    readingObject.priority = readingElement.re_pri.length;
  }
  if (Array.isArray(readingElement.re_inf)) {
    readingObject.info = readingElement.re_inf;
  }

  return readingObject;
};

var parseSenseElement = function (senseElement) {
  var senseObject = {};

  if (Array.isArray(senseElement.pos)) {
    senseObject.partsOfSpeech = senseElement.pos;
  }
  if (Array.isArray(senseElement.gloss)) {
    senseObject.translations = senseElement.gloss;
  }
  if (Array.isArray(senseElement.s_inf)) {
    senseObject.info = senseElement.s_inf;
  }
  if (Array.isArray(senseElement.field)) {
    senseObject.fields = senseElement.field;
  }
  if (Array.isArray(senseElement.xref)) {
    senseObject.similar = senseElement.xref;
  }
  if (Array.isArray(senseElement.ant)) {
    senseObject.antonyms = senseElement.ant;
  }
  if (Array.isArray(senseElement.misc)) {
    senseObject.misc = senseElement.misc;
  }
  if (Array.isArray(senseElement.lsource)) {
    senseObject.loanwords = senseElement.lsource;
  }
  if (Array.isArray(senseElement.dial)) {
    senseObject.dialects = senseElement.dial;
  }
  if (Array.isArray(senseElement.stagr)) {
    senseObject.associatedReadings = senseElement.stagk;
  }
  if (Array.isArray(senseElement.stagk)) {
    senseObject.associatedWritings = senseElement.stagk;
  }

  return senseObject;
};

var storeEntry = function (entry) {
  var entryObject = { _id: entry.ent_seq[0] };

  if (Array.isArray(entry.k_ele)) {
    entryObject.writings = entry.k_ele.map(parseKanjiElement);
  }
  if (Array.isArray(entry.r_ele)) {
    entryObject.readings = entry.r_ele.map(parseReadingElement);
  }
  if (Array.isArray(entry.sense)) {
    entryObject.senses = entry.sense.map(parseSenseElement);
  }

  return entryObject;
};

var parseData = function (db, callback) {
  fs.readFile(xmlFileName, 'utf8', function (err, data) {
    if (err) { throw err; }

    parser.parseString(data, function (err, result) {
      if (err) { throw err; }

      parsedData = result.JMdict.entry.map(storeEntry);

      db.collection('entries').insertMany(parsedData, callback)
    });
  })
}

MongoClient.connect(mongoURL, function(err, db) {
  if (err) { throw err; }

  parseData(db, function(err, result) {
    if (err) { throw err; }

    console.log("done!");
    console.log(result.result.n);
    db.close();
  });
});
