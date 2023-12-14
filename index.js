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

        let list = [];

        let total = 0,
            woman = 0;

        let stats = {
            countries: {},
            industries: {}
        };

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

            let info = {
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
            };

            fs.writeFileSync(
                path + 'info.json',
                JSON.stringify( info, null, 2 ),
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

            let networth = Number( parseFloat( data.finalWorth || 0 ).toFixed( 3 ) );

            let latest = null,
                change = null;

            if( fs.existsSync( path + 'networth.json' ) ) {

                latest = JSON.parse( fs.readFileSync( path + 'networth.json' ) );

                if( latest.value && networth != latest.value ) {

                    let cng = networth - latest.value;

                    change = {
                        value: Number( cng.toFixed( 3 ) ),
                        pct: Number( ( cng / networth * 100 ).toFixed( 3 ) ),
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

            if( change != null || latest == null ) {

                fs.appendFileSync(
                    path + 'history.csv',
                    date + ' ' + networth + '\r\n',
                    { flag: 'a' }
                );

            }

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
             * add list entry
             */

            if( networth >= 1000 ) {

                list.push( {
                    rank: data.rank,
                    uri: data.uri,
                    name: info.name,
                    gender: info.gender,
                    age: info.birthDate ? new Date(
                        new Date() - new Date( info.birthDate )
                    ).getFullYear() - 1970 : null,
                    country: info.citizenship,
                    industries: info.industries,
                    source: info.source,
                    networth: networth,
                    change: change
                } );

                /**
                 * stats
                 */

                total += networth;

                if( info.gender == 'f' ) {

                    woman++;

                }

                if( change != null ) {

                    if( info.industries && info.industries.length > 0 ) {

                        info.industries.forEach( ( _i ) => {

                            let i = _i.toLowerCase();

                            if( !( i in stats.industries ) ) {

                                stats.industries[ i ] = {
                                    value: 0,
                                    count: 0
                                };

                            }

                            stats.industries[ i ].value += change.pct;
                            stats.industries[ i ].count++;

                        } );

                    }

                    if( info.citizenship ) {

                        let c = info.citizenship.toLowerCase();

                        if( !( c in stats.countries ) ) {

                            stats.countries[ c ] = {
                                value: 0,
                                count: 0
                            };

                        }

                        stats.countries[ c ].value += change.pct;
                        stats.countries[ c ].count++;

                    }

                }

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

        /**
         * save daily list
         */

        let ts = new Date(),
            today = ts.getFullYear() + '-' + ( ts.getMonth() + 1 ) + '-' + ts.getDate();

        let stream = JSON.stringify( {
            date: today,
            count: list.length,
            woman: woman,
            total: Number( total.toFixed( 3 ) ),
            list: list
        }, null, 2 );

        fs.writeFileSync(
            __dirname + '/list/' + today + '.json',
            stream, { flag: 'w' }
        );

        fs.writeFileSync(
            __dirname + '/list/latest.json',
            stream, { flag: 'w' }
        );

        /**
         * save stats
         */

        fs.writeFileSync(
            __dirname + '/stats/count',
            list.length.toString(), { flag: 'w' }
        );

        fs.writeFileSync(
            __dirname + '/stats/woman',
            woman.toString(), { flag: 'w' }
        );

        fs.writeFileSync(
            __dirname + '/stats/total',
            total.toFixed( 3 ), { flag: 'w' }
        );

    }

}

run();