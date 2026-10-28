// Catalogue des versions. "pd": true = domaine public. "pd": false = sous droits (licence requise, non incluse).
// Une version est active quand son fichier data/bibles/<id>.json existe (voir tools/import_bible.py).
window.YESHUA_VERSIONS = [
  // ---- Français ----
  { id:"LSG",  lang:"fr", name:"Louis Segond 1910",         short:"Segond",     pd:true  },
  { id:"OST",  lang:"fr", name:"Ostervald",                 short:"Ostervald",  pd:true, verify:true },
  { id:"MAR",  lang:"fr", name:"Martin 1744",               short:"Martin",     pd:true  },
  { id:"DBY",  lang:"fr", name:"Darby (J.N. Darby)",        short:"Darby",      pd:true  },
  { id:"BBB",  lang:"fr", name:"Bovet-Bonnet 1900",         short:"Bovet",      pd:true  },
  { id:"PGR",  lang:"fr", name:"Perret-Gentil et Rilliet",  short:"Rilliet",    pd:true  },
  { id:"BDS",  lang:"fr", name:"La Bible du Semeur",        short:"Semeur",     pd:false },
  { id:"PDV",  lang:"fr", name:"Parole de Vie",             short:"Parole de Vie", pd:false },
  // ---- English ----
  { id:"KJV",  lang:"en", name:"King James Version",        short:"KJV",        pd:true  },
  { id:"WEB",  lang:"en", name:"World English Bible (NHEB)",short:"WEB",        pd:true  },
  { id:"ASV",  lang:"en", name:"American Standard Version", short:"ASV",        pd:true  },
  { id:"YLT",  lang:"en", name:"Young's Literal Translation", short:"YLT",      pd:true  },
  { id:"WBT",  lang:"en", name:"Webster Bible 1833",        short:"Webster",    pd:true  },
  { id:"ROT",  lang:"en", name:"Rotherham (Emphasized Bible)", short:"Rotherham", pd:true },
  { id:"GNV",  lang:"en", name:"Geneva Bible 1599",         short:"Geneva",     pd:true  },
  // ---- Deutsch ----
  { id:"LUT",  lang:"de", name:"Luther 1912",               short:"Luther 1912",pd:true  },
  { id:"L45",  lang:"de", name:"Luther 1545",               short:"Luther 1545",pd:true  },
  { id:"ELB",  lang:"de", name:"Elberfelder 1905",          short:"Elberfelder",pd:true  },
  { id:"E71",  lang:"de", name:"Elberfelder 1871",          short:"Elb. 1871",  pd:true  }
];
