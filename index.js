'use strict';

const axios = require( 'axios' );
const fs = require( 'fs' );

async function run() {

    /**
     * fetch data
     */

    const response = await axios.get(
        'https://www.forbes.com/forbesapi/person/rtb/0/position/true.json'
    );

    if(
        response.data && response.data.personList &&
        response.data.personList.personsLists
    ) {

        response.data.personList.personsLists.forEach( ( data ) => {

            let path = __dirname + '/profile/' + data.uri + '/';

            /**
             * create new folder if not exists
             */

            if( !fs.existsSync( path ) ) {

                fs.mkdirSync( path, { recursive: true } );

            }

            /**
             * save profile info
             */

            fs.writeFileSync(
                path + 'info.json',
                JSON.stringify( {
                    name: data.person.name || data.personName || null,
                    gender: data.gender.toLowerCase() || null,
                    birthDate: data.birthDate
                        ? new Date( data.birthDate )
                        : null,
                    citizenship: data.countryOfCitizenship || null,
                    state: data.state || null,
                    city: data.city || null,
                    source: data.source || null,
                    industries: data.industries || null
                } || null, null, 2 ),
                { flag: 'w' }
            );

            /**
             * save bios
             */

            fs.writeFileSync(
                path + 'bio.json',
                JSON.stringify( data.bios || null, null, 2 ),
                { flag: 'w' }
            );

            /**
             * save financial assets
             */

            fs.writeFileSync(
                path + 'assets.json',
                JSON.stringify( data.financialAssets || null, null, 2 ),
                { flag: 'w' }
            );

            /**
             * save last touched timestamp
             */

            fs.writeFileSync(
                path + 'timestamp',
                ( new Date( data.timestamp ) ).toISOString(),
                { flag: 'w' }
            );

        } );

    }

}

run();