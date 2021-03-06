/**
 * Created by HZM on 2018/1/31.
 */
function mockData() {
    /* mock普通人辨识问题数据 */
    /* type 1为阳虚质，2为阴虚质，3为气虚质，4为痰湿质，5为湿热质，6为血瘀质，7为特禀质，8为气郁质，9为平和质*/
    var data = {
        list:[
            {"id": "1","title": "您手脚发凉吗？","type": "1"},
            {"id": "2","title": "您胃脘部、背部或腰膝部怕冷吗？","type": "1"},
            {"id": "3","title": "您感到怕冷、衣服比别人穿得多吗？","type": "1"},
            {"id": "4","title": "您比一般人不了寒冷（冬天的寒冷，夏天的冷空调、电扇等。","type": "1"},
            {"id": "5","title": "您比别人容易患感冒吗？","type": "1"},
            {"id": "6","title": "您吃（喝）凉的东西会感到不舒服或者怕吃（喝）凉东西吗？","type": "1"},
            {"id": "7","title": "你受凉或吃（喝）凉的东西后，容易腹泻（拉肚子）吗？","type": "1"},

            {"id": "8","title": "您感到手脚心发热吗？","type": "2"},
            {"id": "9","title": "您感觉身体、脸上发热吗？","type": "2"},
            {"id": "10","title": "您皮肤或口唇干吗？","type": "2"},
            {"id": "11","title": "您口唇的颜色比一般人红吗？","type": "2"},
            {"id": "12","title": "您容易便秘或大便干燥吗？","type": "2"},
            {"id": "13","title": "您面部两潮红或偏红吗？","type": "2"},
            {"id": "14","title": "您感到眼睛干涩吗？","type": "2"},
            {"id": "15","title": "您活动量稍大就容易出虚汗吗？","type": "2"},

            {"id": "16","title": "你容易疲乏吗？","type": "3"},
            {"id": "17","title": "您容易气短（呼吸短促，接不上气吗？","type": "3"},
            {"id": "18","title": "您容易心慌吗？","type": "3"},
            {"id": "19","title": "您容易头晕或站起时晕眩吗？","type": "3"},
            {"id": "20","title": "您比别人容易患感冒吗？","type": "3"},
            {"id": "21","title": "您喜欢安静、懒得说话吗？","type": "3"},
            {"id": "22","title": "您说话声音无力吗？","type": "3"},
            {"id": "23","title": "您活动量就容易出虚汗吗？","type": "3"},

            {"id": "24","title": "您感到胸闷或腹部胀满吗？","type": "4"},
            {"id": "25","title": "您感到身体学生不轻松或不爽快吗？","type": "4"},
            {"id": "26","title": "您腹部肥满松软吗？","type": "4"},
            {"id": "27","title": "您有额部油脂分泌多的现象吗？","type": "4"},
            {"id": "28","title": "您上眼睑比别人肿（仍轻微隆起的现象）吗？","type": "4"},
            {"id": "29","title": "您嘴里有黏黏的感觉吗？","type": "4"},
            {"id": "30","title": "您平时痰多，特别是咽喉部总感到有痰堵着吗？","type": "4"},
            {"id": "31","title": "您舌苔厚腻或有舌苔厚厚的感觉吗？","type": "4"},

            {"id": "32","title": "您面部或鼻部有油腻感或者油亮发光吗？","type": "5"},
            {"id": "33","title": "你容易生痤疮或疮疖吗？","type": "5"},
            {"id": "34","title": "您感到口苦或嘴里有民味吗？","type": "5"},
            {"id": "35","title": "您大便黏滞不爽、有解不尽的感觉吗？","type": "5"},
            {"id": "36","title": "您小便时尿道有发热感、尿色浓（深）吗？","type": "5"},
            {"id": "37","title": "您带下色黄（白带颜色发黄）吗？（限女性）","type": "5"},
            {"id": "38","title": "您的阴囊部位潮湿吗？（限男性）","type": "5"},

            {"id": "39","title": "您的皮肤在不知不觉中会出现青紫瘀斑（皮下出血）吗？","type": "6"},
            {"id": "40","title": "您两颧部有细微红丝吗？","type": "6"},
            {"id": "41","title": "您身体上有哪里疼痛吗？","type": "6"},
            {"id": "42","title": "您面色晦黯或容易出现褐斑吗？","type": "6"},
            {"id": "43","title": "您容易有黑眼圈吗？","type": "6"},
            {"id": "44","title": "您容易忘事（健忘）吗？","type": "6"},
            {"id": "45","title": "您口唇颜色偏黯吗？","type": "6"},

            {"id": "46","title": "您没有感冒时也会打喷嚏吗？","type": "7"},
            {"id": "47","title": "您没有感冒时也会鼻塞、流鼻涕吗？","type": "7"},
            {"id": "48","title": "您有因季节变化、温度变化或异味等原因而咳喘的现象吗？","type": "7"},
            {"id": "49","title": "您容易过敏（对药物、食物、气味、花粉或在季节交替、气候变化时）吗？","type": "7"},
            {"id": "50","title": "您的皮肤容易起荨麻疹（风团、风疹块、风疙瘩）吗？","type": "7"},
            {"id": "51","title": "您的因过敏出现过紫癜（紫红色瘀点、瘀斑）吗？","type": "7"},
            {"id": "52","title": "您的皮肤一抓就红，并出现抓痕吗？","type": "7"},

            {"id": "53","title": "您感到闷闷不乐吗？","type": "8"},
            {"id": "54","title": "您容易精神紧张、焦虑不安吗？","type": "8"},
            {"id": "55","title": "您多愁善感、感情脆弱吗？","type": "8"},
            {"id": "56","title": "您容易感到害怕或受到惊吓吗？","type": "8"},
            {"id": "57","title": "您胁肋部或乳房腹痛吗？","type": "8"},
            {"id": "58","title": "您无缘无故叹气吗？","type": "8"},
            {"id": "59","title": "您咽喉部有异物感，且吐之不出、咽之不下吗？","type": "8"},

            {"id": "60","title": "您精力充沛吗？","type": "9"},
            {"id": "61","title": "您容易疲乏吗？","type": "9"},
            {"id": "62","title": "您说话声音无力吗？","type": "9"},
            {"id": "63","title": "您感到闷闷不乐吗？","type": "9"},
            {"id": "64","title": "您比一般 人耐受不了寒冷（冬天的寒冷，夏天的冷空调、电扇）吗？","type": "9"},
            {"id": "65","title": "您能适应外界自然和社会环境的变化吗？","type": "9"},
            {"id": "66","title": "您容易失眠吗？","type": "9"},
            {"id": "67","title": "您容易忘事（健忘）吗？","type": "9"},
        ],
    }
    return data;
}