document.getElementById('btn-send').addEventListener('click', function(){

    let btn = document.getElementById('btn').value;
    
    function connect_to_api()
    {
        axios.get('http://www.omdbapi.com/[your-api-key]' + btn)
        .then((response)=>{
            let search_movies = response.data.Search;
            let movies = Array.from(search_movies);

            function inject_movies()
            {
                let inject_movies = '';

                movies = movies;
                movies.forEach(function(movie)
                {
                    inject_movies += 
                    `
                    <div class='movie-card'>
                    
                    <div class='add_to_library' id='lt${movie.imdbID}'>Added to library</div>
                    <img src = "${movie.Poster}" class='movie-poster'>

                    <div class = 'movie-title'>${movie.Title}</div>

                    <div class='btns-movies'>
                    
                    <input type='submit' class='btn-send btn-library' value='Add to library' onclick='add_to_library(this.id)' id='${movie.imdbID}'>

                    </div>

                    </div>
                    
                    `
                });

                document.getElementById('bottom').innerHTML = inject_movies;

            }

            inject_movies();


        })
        .catch((error)=>{
            console.log(error);
        });
        
    }

    connect_to_api();

});


let library_ids = [];
let counter = 0;

function rate_movie(clicked_id)
    {
        
        localStorage.setItem('Rate-id', JSON.stringify(clicked_id));

        let container = document.getElementById('full_container');
        container.style.pointerEvents = 'none';
        container.style.transition = 'all 0.7s';
        container.style.filter = 'blur(2.5px)';

        let popup = document.getElementById('star_container');
        popup.style.display ='flex';
        let current_rate_btn = document.getElementById(clicked_id);
        current_rate_btn.style.display = 'none';

        let img_id_full = JSON.parse(localStorage.getItem('Rate-id'));
        let img_id_split =img_id_full.split('r');
        let img_id_extracted = img_id_split[1];
        let img_id = 'mp'+img_id_extracted;
        
        let catched_img = document.getElementById(img_id);
        catched_img.className = 'movie-poster-grey';

    }
    
    function get_star_value(star_id) 
    {
        let split_id = star_id.split('-');
        let true_star_id = split_id[1];
        localStorage.setItem('Star-id', JSON.stringify(true_star_id));

    }

    let all_rated_ids = [];
    function close_popup()
        {
            let popup = document.getElementById('star_container');
            popup.style.display = 'none';

            let container = document.getElementById('full_container');
            container.style.pointerEvents = 'auto';
            container.style.filter = 'blur(0)';
            
            let star_id = JSON.parse(localStorage.getItem('Star-id'));
            if(!star_id)
            {
                star_id = 0;
            }

            let btns_id_full = JSON.parse(localStorage.getItem('Rate-id'));
            let btns_id_split = btns_id_full.split('r');
            btns_id_half = btns_id_split[1];
            btns_id = 'btns'+btns_id_half;
            let btns_id_catch = document.getElementById(btns_id);
 

            let div = document.createElement('div');
            div.setAttribute('id', 'rated'+btns_id_half);
            div.className = 'rated_movie';
            btns_id_catch.appendChild(div);
            
            let full_rate_div_id = 'rated'+btns_id_half)
            let catched_rate_div = document.getElementById(full_rate_div_id);
            
            catched_rate_div.innerHTML = star_id+'/5';
            
            all_rated_ids.push(full_rate_div_id);
            localStorage.setItem('Rated', JSON.stringify(all_rated_ids));
            localStorage.removeItem('Star-id');

            

            
        }

let all_library_ids = [];

function add_to_library(library_id)
{
    all_library_ids.push(library_id);
    localStorage.setItem('ID_Keys', JSON.stringify(all_library_ids));

    add_to_library_id = 'lt'+library_id;
    let catched_add_to_library = document.getElementById(add_to_library_id);
    console.log(catched_add_to_library);

    catched_add_to_library.style.opacity = '100%';
       
}

document.getElementById('btn-library').addEventListener('click', function()
{
    document.getElementById('bottom').innerHTML = ' ';

    function get_allStorage() {

    let all_library_movies = [];
    let inject_library_movies = '';

       let library_keys = JSON.parse(localStorage.getItem('ID_Keys'));
       
       
       function return_library_movies() {
            for(let i = 0; i < library_keys.length; i++)
            {
                axios.get('http://www.omdbapi.com/?[your-api-key]' + library_keys[i]).then((good_response_library)=>{

                    let library_movies = good_response_library.data;
                    all_library_movies.push(library_movies);

                    document.getElementById('bottom').innerHTML +=

                            `
                            <div class='movie-card' id='mc${library_movies.imdbID}'>
                            
                            <img src = "${library_movies.Poster}" class='movie-poster' id='mp${library_movies.imdbID}'>
                            <div class = 'movie-title'>${library_movies.Title}</div>

                            <div class='btns-movies' id='btns${library_movies.imdbID}'>
                            
                            <input type='submit' class='btn-send btn-delete' value='Delete' onclick='delete_movie(this.id)' id='${library_movies.imdbID}'>
                            <input type='submit' class='btn-send btn-score' value='Rate'  onclick='rate_movie(this.id)' id='r${library_movies.imdbID}'>
                            </div>

                            </div>
                            
                            `;
                    

                }).catch((bad_response_library)=>{
                    console.log(bad_response_library);
                });

            }

    }
    return_library_movies();

    }

    get_allStorage();
    
});


function delete_movie(delete_id)
{
    let library_keys = JSON.parse(localStorage.getItem('ID_Keys'));
    let delete_key = library_keys.indexOf(delete_id);

    library_keys.splice(delete_key, 1);
    localStorage.setItem('ID_Keys', JSON.stringify(library_keys));
    
    document.getElementById('mc'+delete_id).remove();

}