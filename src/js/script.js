const API_KEY = "c120fedf6674e771f5af2e7fb14750813d7f479bab5f09c39dab738fab2f56f2"

async function fetchData(){
    try {
        const country = fetch(`https://apiv3.apifootball.com/?action=get_countries&APIkey=${API_KEY}`);
        const league = fetch(`https://apiv3.apifootball.com/?action=get_leagues&APIkey=${API_KEY}`);
        const match = fetch(`https://apiv3.apifootball.com/?action=get_events&from=2024-04-27&to=2024-04-29&league_id=152&APIkey=${API_KEY}`);
        
        const [countryData, leagueData, matchData] = await Promise.all([country, league ,match].map(p => p.then(response => response.json())));
        
        uniqueLeagues = []

        for(const league of leagueData){
            const existingLeague = uniqueLeagues.find(item => item.league_name === league.league_name);
            // If no league with the same league_name is found, add it to the uniqueLeagues array
            if (!existingLeague) {
                uniqueLeagues.push(league);
            }
        }

        return {
            countries: countryData,
            leagues: uniqueLeagues,
            latestMatches: matchData,
        };
    } catch (error) {
        // alert(error.message);
        console.error('Error fetching data:', error);
    }
}

async function updateCounts() {
    const data = await fetchData();

    const countryCount = data.countries.length;
    document.getElementById('countryTotal').innerHTML = `<p>${countryCount}</p>`;

    const leagueCount = data.leagues.length;
    document.getElementById('leagueTotal').innerHTML = `<p>${leagueCount}</p>`;

    const latestMatches = data.latestMatches;
    matchContainer = document.getElementById('match');
    matchContainer.innerHTML = '';

    const countryContainer = document.getElementById('country');
    const leagueContainer = document.getElementById('league');

    for (const match of latestMatches) {
        matchContainer.innerHTML += `
        <div class="card bg-base-100 shadow-md rounded-lg mt-8 text-[#959FA8] text-lg shadow-lg">
            <div class="flex px-16 py-7 items-center">
                <img src="${match.team_home_badge}" alt="team-home-logo" class="size-11">
                <p class="mx-6 w-36">${match.match_hometeam_name}</p>
                <p class="w-11">${match.match_hometeam_score} - ${match.match_awayteam_score}</p>
                <p class="mx-6 w-40">${match.match_awayteam_name}</p>
                <img src="${match.team_away_badge}" alt="team-away-logo" class="size-11">

                <img src="/public/images/date-icon.svg" alt="date-icon" class="ml-24">
                <p class="ml-3">${match.match_date} ${match.match_time}</p>

                <img src="/public/images/match-location.svg" alt="location-logo" class="ml-10">
                <p class="ml-3 w-[440px]">${match.match_stadium}</p>

                <p class="bg-green-100 text-green-500 py-2 px-4 rounded rounded-lg">${match.match_status ? match.match_status : "Upcoming"}</p>
            </div>
        </div>
        `
    }

    const countries = data.countries
    const leagues = data.leagues
    console.log(countries)

    for (let i = 0; i < 5; i++) {
        let leagueCountry = []
        for(const league of leagues){
            if (league.country_id === countries[i].country_id){
                const existingLeague = leagueCountry.find(item => item.league_name === league.league_name);
                // If no league with the same league_name is found, add it to the uniqueLeagues array
                if (!existingLeague) {
                    leagueCountry.push(league);
                }
            } 
        }
        console.log("League Country :", leagueCountry)
        
        let countryTeams = []
        for(const league of leagueCountry){
            const countryTeam = await fetch(`https://apiv3.apifootball.com/?action=get_teams&league_id=${league.league_id}&APIkey=${API_KEY}`);
            const teams = await countryTeam.json()
            console.log("teams",teams)
            for(let team of teams){
                countryTeams.push(team)
            }
        }
        console.log(countryTeams)

        // console.log(countries[i].country_logo, countries[i].country_name)
        // const country = array[i];
        countryContainer.innerHTML += `
        <img src="${countries[i].country_logo}" alt="country-logo" class="mx-auto w-20">
        <p class="flex justify-center items-center">${countries[i].country_name}</p>
        <p class="flex justify-center items-center">${leagueCountry.length}</p>
        <p class="flex justify-center items-center">${countryTeams.length}</p>
        `

        const topStanding = await fetch(`https://apiv3.apifootball.com/?action=get_standings&league_id=${leagues[i].league_id}&APIkey=${API_KEY}`);
        const topStandingData = await topStanding.json()
        console.log("League ID : ",leagues[i].league_id)


        leagueContainer.innerHTML += `
        <img src="${leagues[i].league_logo}" alt="league-logo" class="mx-auto w-20">
        <p class="flex justify-center items-center">${leagues[i].league_name}</p>
        <p class="flex justify-center items-center">${leagues[i].league_season}</p>
        <div class="flex justify-center items-center">
            <img src="${topStandingData[0].team_badge}" alt="team-badge" class="size-14 mr-6">
            <p>${topStandingData[0].team_name}</p>
        </div>
        
        `
    }
    

    const loadingSpinner = document.querySelector('.loading');
    loadingSpinner.parentNode.removeChild(loadingSpinner);
}

window.addEventListener('load', updateCounts);