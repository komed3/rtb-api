'use strict';

const axios = require( 'axios' );
const fs = require( 'fs' );

async function run() {

    const response = await axios.get(
        'https://www.forbes.com/forbesapi/person/rtb/0/position/true.json'
    );

    if(
        response.data && response.data.personList &&
        response.data.personList.personsLists
    ) {

        response.data.personList.personsLists.forEach( ( data ) => {

            let path = __dirname + '/profile/' + data.uri + '.json',
                profile = {};

            /**
             * load profile if available
             */

            if( fs.existsSync( path ) ) {

                profile = JSON.parse(
                    fs.readFileSync( path ) || '{}'
                );

            }

            /**
             * profile info and bio
             */

            profile.profile = {};

            profile.profile.name = data.person.name || data.personName || null;
            profile.profile.gender = data.gender.toLowerCase() || null;
            profile.profile.birthDate = data.birthDate
                ? new Date( data.birthDate )
                : null;

            profile.profile.citizenship = data.countryOfCitizenship || null;
            profile.profile.state = data.state || null;
            profile.profile.city = data.city || null;

            profile.bio = data.bios || null;

            /**
             * net worth data
             */

            profile.source = data.source || null;
            profile.industries = data.industries || null;
            profile.assets = data.financialAssets || null;

            /**
             * update list data
             */

            profile.rank = data.rank || null;
            profile.worth = parseFloat(
                data.finalWorth ||
                data.archivedWorth ||
                0
            );

            /**
             * save profile
             */

            profile.touched = new Date();

            fs.writeFileSync(
                path,
                JSON.stringify( profile, null, 4 ),
                { flag: 'w' }
            );

        } );

    }

}

run();