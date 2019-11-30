<template>
  	<div :id="id" :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
import resize from './mixins/resize'

export default {
  name: 'CalendarHeatmap',
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    id: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '200px'
    },
    height: {
      type: String,
      default: '200px'
    },
    calendarData : {
    	type : Array,
      	default: function(){
      		return []
      	}
    },
  },
  data() {
    return {
      chart: null,
      range : null
    }
  },
  created(){

  },
  mounted() {
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },

  methods: {
    initChart() {
    	if(this.calendarData.length == 0){
			let dayTime = 24 * 3600 * 1000
			let now = (new Date()).getTime()
			let begin = now - 365 * dayTime
			var data = []
			for (var time = begin; time < now; time += dayTime) {
		        data.push([
		            echarts.format.formatTime('yyyy-MM-dd', time),
		            Math.floor(Math.random() * 10)
		        ])
		    }
		    this.calendarData = data
		    this.range = [echarts.format.formatTime('yyyy-MM-dd', begin), echarts.format.formatTime('yyyy-MM-dd', now)]
	    }
      	this.chart = echarts.init(document.getElementById(this.id))
      	let options = {
		    visualMap: {
		        min: 0,
		        max: 10,
		        type: 'piecewise',
		        orient: 'horizontal',
		        left: 'center',
		        top: 140,
		        textStyle: {
		            color: '#000'
		        }
		    },
		    calendar: {
		        top: 30,
		        left: 50,
		        right: 50,
		        cellSize: [10, 14],
		        splitLine:{
		        	lineStyle:{
		        		color: '#FFF',
		        		width: 3,
		        	}
		        },
		        range: this.range,
		        itemStyle: {
		            normal: {borderWidth: 0.5}
		        },
		        yearLabel: {show: false},
		        monthLabel: {
			        nameMap: 'cn'
		        },
		        dayLabel: {
			        nameMap: ['', '周 一', '', '周 三', '', '周 五', '']
			    },
		        itemStyle: {
		            normal: {
		                color: '#F3F3F3',
		                borderWidth: 3,
		                borderColor: '#F3F3F3'
		            }
		        }
		    },
		    series: {
		        type: 'heatmap',
		        coordinateSystem: 'calendar',
		        data: this.calendarData
		    }
	  	};
	  	this.chart.setOption(options)
  	}
  }
}
</script>

