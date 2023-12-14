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

            let path = __dirname + '/profile/' + data.uri + '/',
                ts = new Date( data.timestamp ),
                date = ts.getFullYear() + '-' + ( ts.getMonth() + 1 ) + '-' + ts.getDate();

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
             * update net worth data
             */

            let networth = parseFloat(
                data.finalWorth ||
                data.archivedWorth ||
                0
            );

            let change = null;

            if( fs.existsSync( path + 'networth.json' ) ) {

                let latest = JSON.parse( fs.readFileSync( path + 'networth.json' ) );

                if( latest.value && networth != latest.value ) {

                    let cng = networth - latest.value;

                    change = {
                        value: cng,
                        pct: cng / networth * 100,
                        date: date
                    };

                }

            }

            fs.writeFileSync(
                path + 'networth.json',
                JSON.stringify( {
                    value: networth,
                    change: change,
                    private: parseFloat( data.privateAssetsWorth || 0 ),
                    archived: parseFloat( data.archivedWorth || 0 )
                } || null, null, 2 ),
                { flag: 'w' }
            );

            /**
             * update net worth history (chart data)
             */

            fs.appendFileSync(
                path + 'history.csv',
                date + ' ' + networth + '\r\n',
                { flag: 'a' }
            );

            /**
             * save rank if net worth > 0
             */

            if( networth > 0 ) {

                fs.writeFileSync(
                    path + 'rank.json',
                    JSON.stringify( {
                        rank: data.rank,
                        date: date
                    } || null, null, 2 ),
                    { flag: 'w' }
                );

            }

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