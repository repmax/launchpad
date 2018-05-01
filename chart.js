const spec = {
  "$schema": "https://vega.github.io/schema/vega/v3.json",
  "width": 710,
  "height": 400,
  "padding": 5,
  "myList": [
          "basis",
          "cardinal",
          "catmull-rom",
          "linear",
          "monotone",
          "natural",
          "step",
          "step-after",
          "step-before"
        ],

  "signals": [
    {
      "name": "currentTid", "value": "t1",
      "bind": {"input": "radio", "options":  [
          "t1",
          "t2",
          "t3",
          "t5",
          "t1_s0",
          "t1_s5",
          "t1_s6",
          "t5_s2",
          "t5_s3",
          "t5_s5"
        ]}
    },
    {
      "name": "norm", "value": "normalized",
      "bind": {"input": "radio", "options": ["normalized", "focus"]}
    },
    {
      "name": "interpolate", "value": "basis",
      "bind": {"input": "radio", "options": [
          "basis",
          "linear",
          "monotone",
          "natural",
          "step"
        ]
      }
    }
  ],

  "data": [
    {
      "name": "papersYear",
      "format": {"type": "tsv", "parse": {"count":"number", "year": "date"}},
      "url": "https://raw.githubusercontent.com/repmax/data/master/steam.tsv"
    },
    {
      "name": "refPapersYear",
      "source": "papersYear",
      "transform": [
        {"type": "filter", "expr": "norm == 'focus' ? datum.tid == currentTid : isString(datum.tid)"}
      ]
    },
    {
      "name": "tidPapersYear",
      "source": "papersYear",
      "transform": [
        {"type": "filter", "expr": "datum.tid == currentTid"}
      ]
    },
    {
      "name": "topCitations",
      "format": {"type": "tsv", "parse": {"pubmed": "number", "year": "date", "cited":"number"}},
      "url": "https://raw.githubusercontent.com/repmax/data/master/topcitation_topic.tsv"
    },
    {
      "name": "refTopCitations",
      "source": "topCitations",
      "transform": [
        {"type": "filter", "expr": "norm == 'focus' ? datum.tid == currentTid : isString(datum.tid)"}
      ]
    },
    {
      "name": "tidTopCitations",
      "source": "topCitations",
      "transform": [
        {"type": "filter", "expr": "datum.tid == currentTid"}
      ]
    }
  ],

  "scales": [
    {
      "name": "x",
      "type": "time",
      "nice" : true,
      "domain": {"data": "refPapersYear", "field": "year"},
      "range": "width"
    },
    {
      "name": "y",
      "type": "linear",
      "range": "height",
      "nice": true,
      "zero": true,
      "domain": {"data": "refPapersYear", "field": "count"}
    },
    {
      "name": "z",
      "type": "linear",
      "range": "height",
      "nice": true,
      "zero": true,
      "domain": {"data": "refTopCitations", "field": "cited"}
    }
  ],
  "config": {
    "axisRight": {
      "domain": true,
      "domainColor": "#9942f0",
      "domainWidth": 3,
      "tickWidth": 2
    },
      "axisY": {
      "domain": true,
      "domainColor": "#00cc99",
      "domainWidth": 3,
      "tickWidth": 2,
      "titleFontSize": 15
    },
      "axisX": {
      "domain": true,
      "domainWidth": 2,
      "tickWidth": 2
    }
  },
  "axes": [
    {"orient": "bottom",
     "scale": "x",
     "grid": true,
     "ticks": true,
     "offset": 10
    },
    {"orient": "left",
     "scale": "y",
      "offset": 10,
      "title": "publications",
      "titlePadding": 10
    },
    {
      "orient": "right",
      "scale": "z",
      "title": "citations",
      "offset": 10,
      "titlePadding": 10
    }
  ],
  "marks": [
    {
      "type": "line",
      "from": {"data": "tidPapersYear"},
      "encode": {
        "enter": {
          "x": {"scale": "x", "field": "year"},
          "y": {"scale": "y", "field": "count"},
          "stroke": {"value": "#00cc99"},
          "strokeWidth": {"value": 4},
          "strokeOpacity": {"value": 0.8}
        },
        "update": {
          "x": {"scale": "x", "field": "year"},
          "y": {"scale": "y", "field": "count"},
          "interpolate": {"signal": "interpolate"}
        }
      }
    },
    {
      "name": "marks",
      "type": "symbol",
      "from": {"data": "tidTopCitations"},
      "encode": {
        "enter": {
          "x": {"scale": "x", "field": "year"},
          "y": {"scale": "z", "field": "cited"},
          "shape": {"value": "circle"},
          "strokeWidth": {"value": 2},
          "opacity": {"value": 0.8},
          "stroke": {"value": "#9942f0"},
          "fill": {"value": "transparent"}
        },
        "update": {
          "x": {"scale": "x", "field": "year"},
          "y": {"scale": "z", "field": "cited"}
        }
      }
    },
    {
      "type": "text",
      "from": {"data": "tidTopCitations"},
      "encode": {
        "enter": {
          "fill": {"value": "#000"},
          "text": {"field": "last_name", "type": "text"},
          "fontColor": {"value":"#666666"},
          "font":   {"value":"monospace"},
          "fontSize": {"value":12}
        },
        "update": {
          "opacity": {"value": 1},
          "x": {"scale": "x", "field": "year"},
          "y": {"scale": "z", "field": "cited"},
          "tooltip": {"signal": "{title: datum.cid, 'Title': datum.title, 'Cited': datum.cited, 'Doi': datum.pid, 'Pubmed': datum.pubmed }"},
          "dx":   {"value":10},
          "align": {"value": "left"},
          "baseline":  {"value":"middle"},
          "opacity": {"value": 0.8}
        },
        "hover": {
          "opacity": {"value": 0.5}
        }
      }
    }
  ]
}

draw = function () { 
  vegaEmbed('#vis', spec, {renderer: "svg"});
}