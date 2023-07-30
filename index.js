class App extends React.Component
{
    render()
    {
        return (
            <div className="App">
                <Weather />
            </div>
        );
    }
}

let dict = {
    en: {
        title: "5 Day Weather Forecast",
        city: "Ivanovo",
        current: "Current Forecast"
    },
    ru: {
        title: "5-дневный Прогноз Погоды",
        city: "Иваново",
        current: "Текущий Прогноз"
    }
}
let translator = new EOTranslator(dict);

class Weather extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            fullData: [],
            dailyData: [],
            currentData: [],
            dataLoaded: false,
            lang: 'ru'
        };
    }

    componentDidMount = () =>
    {
        this.timerID = setInterval(() => this.fetching(), 1000);
    }
        
    componentWillUnmount()
    {
        clearInterval(this.timerID);
    }

    render()
    { 
        if (this.state.dataLoaded)
        {
        return (
            <div className="container">
                <select name="" id="input0" required="required" onChange={this.selectLang}>
                    <option  value="ru">ru</option>
                    <option  value="en">en</option>
                </select>
                {/*Сюда translator на слова*/}
                <h1 className="display-1 jumbotron">{translator.translate("title", {lang: this.state.lang})}</h1>
                <h5 className="display-5 text-muted">{translator.translate("city", {lang: this.state.lang})}</h5>
                <div className="row justify-content-center">
                    {this.state.dailyData.map((elem, index) => <DayCard reading={elem} key={index} lang={this.state.lang}/>)}
                </div>
                <br/>
                <h1 className="display-1 jumbotron">{translator.translate("current", {lang: this.state.lang})}</h1>
                <div className="row justify-content-center">
                    <DayCard reading={this.state.currentData} />
                </div>
            </div>
        );
        }
    }

    selectLang = (event) =>
    {   
        let lang = event.target.value;
        switch(lang)
        {
            case 'ru':
                this.setState({lang: 'ru'}, () => console.log(this.state.lang));
                this.fetching();
                break;
            case 'en':
                this.setState({lang: 'en'}, () => console.log(this.state.lang));
                this.fetching();
                break; 
        }         
    }

    fetching = () =>
    {
        let WeatherAPIFive = `http://api.openweathermap.org/data/2.5/forecast?lat=56.995468&lon=40.978222&units=metric&lang=${this.state.lang}&appid=5ca2925b25b202690fba15272717557a`
        let WeatherAPICurrent = `http://api.openweathermap.org/data/2.5/weather?lat=56.995468&lon=40.978222&units=metric&lang=${this.state.lang}&appid=5ca2925b25b202690fba15272717557a`
        console.log(WeatherAPIFive);

        fetch(WeatherAPIFive)
        .then((response) => response.json())
        .then ((data) => 
        {
            const dailyData = data.list.filter((elem) => elem.dt_txt.includes("15:00:00"));
            this.setState({
                fullData: data.list,
                dailyData: dailyData,
            }, () => console.log(this.state))
        })

        // Тут еще один AJAX запрос для текущей погоды. В render() вывод еще одной карточки.
        fetch(WeatherAPICurrent)
        .then((response) => response.json())
        .then((data) => {
            this.setState({
                currentData: data,
                dataLoaded: true
            }, () => console.log(this.state))
        })
    }

}

class DayCard extends React.Component
{
    render()
    {
        moment.locale(this.props.lang);
        let newDate = new Date();
        const weekday = this.props.reading.dt * 1000;
        newDate.setTime(weekday);
        let weatherIDImg = this.props.reading.weather[0].id;
        const imgURL = `owf owf-${weatherIDImg} owf-5x`;
        return (
            <div className="col-sm-2">
                <div className="card">
                    <h3 className="class-title">{moment(newDate).format('dddd').capitalize()}</h3>
                    <p className="text-muted">{moment(newDate).format('MMMM Do, h:mm a').capitalize()}</p>
                    <i className={imgURL}></i>
                    <h2>{Math.round(this.props.reading.main.temp)}°C</h2>
                    {/*<div className="card-body">
                        <p className="card-text">{this.props.reading.weather[0].description}</p>
                    </div>*/}
                </div>    
            </div>
        );
    }
}

Object.defineProperty(String.prototype, 'capitalize', {
    value: function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
    },
    enumerable: false
});

