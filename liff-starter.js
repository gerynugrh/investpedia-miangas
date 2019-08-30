window.onload = function (e) {
    liff.init(function (data) {
        initializeApp(data);
    });
    
    const searchParam = new URLSearchParams(location.search);
    investmentId = searchParam.get("id");

    fetch(`${baseUrl}/investment?id=${investmentId}`)
        .then(result => result.json())
        .then(data => renderInvestmentData(data));

    $("#add-button").click(() => {
        const value = $("#value-field").val();
        fetch(`${baseUrl}/add_fund?id=${investmentId}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                line_id: userId,
                amount: parseInt(value)
            })
        }).then(result => liff.closeWindow())
    });
};

const baseUrl = "https://investpedia.herokuapp.com";
let userId;
let investmentId;

function initializeApp(data) {
    userId = data.context.userId;
}

function renderInvestmentData(data) {
    let imageUrl;
    if (data.investment.product) {
        imageUrl = data.investment.product.ImageURL;
    } else {
        imageUrl = "https://www.unilever.co.id/id/Images/Keluarga-Bahagia-Gendong-Anak_tcm1310-496010_w720.jpg"
    }
    var bar = new ProgressBar.Line(progressContainer, {
        strokeWidth: 4,
        easing: 'easeInOut',
        duration: 1400,
        color: '#FFEA82',
        trailColor: '#eee',
        trailWidth: 1,
        svgStyle: {width: '100%', height: '20px'},
        from: {color: '#FFEA82'},
        to: {color: '#ED6A5A'},
        step: (state, bar) => {
            bar.path.setAttribute('stroke', state.color);
        }
    });
    $("#investment-content").append(
        `
                <a class="cardLink" href="">
                    <img class="cardImage" alt="/detail.html?"
                         src="${imageUrl}" />
                </a>
                <div class="cardInfo">
                    <h1 class="cardName">${data.investment.Name}</h1>
                </div>
        `
    );
    bar.animate(data.investment.Current / data.investment.Goal);
}