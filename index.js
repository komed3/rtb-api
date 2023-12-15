'use strict';

const dir = __dirname + '/api/';
const api = 'https://www.forbes.com/forbesapi/person/rtb/0/position/true.json';
const today = ( new Date() ).toISOString().split( 'T' )[0];

const axios = require( 'axios' );
const fs = require( 'fs' );

async function run() {

    /**
     * create folders (if not exists)
     */

    [
        'list/rtb/',
        'movers/pct/winner/',
        'movers/pct/loser/',
        'movers/value/winner/',
        'movers/value/loser/',
        'profile/',
        'stats/country/',
        'stats/industry/'
    ].forEach( ( d ) => {

        fs.mkdirSync( dir + d, { recursive: true } );

    } );

    /**
     * fetch data
     */

    const response = await axios.get( api );

    if(
        response.data && response.data.personList &&
        response.data.personList.personsLists
    ) {

        let stream = '';

        let list = [];

        let stats = {
            total: 0,
            count: 0,
            woman: 0,
            industry: {},
            country: {}
        };

        let movers = {
            value: {},
            pct: {}
        };

        /**
         * run through profiles
         */

        response.data.personList.personsLists.forEach( ( profile ) => {

            let uri = profile.uri.trim(),
                ts = ( new Date( profile.timestamp ) ).toISOString().split( 'T' )[0],
                path = dir + 'profile/' + uri + '/';

            /**
             * create new folder if not exists
             */

            if( !fs.existsSync( path ) ) {

                fs.mkdirSync( path, { recursive: true } );

            }

            /**
             * basic profile info
             */

            let birthDate = profile.birthDate
                ? new Date( profile.birthDate )
                : null;

            let info = {
                uri: uri,
                name: ( profile.person.name || profile.personName || '' ).trim(),
                gender: profile.gender
                    ? profile.gender.toLowerCase()
                    : null,
                birthDate: birthDate,
                age: birthDate
                    ? new Date(
                          new Date() - new Date( birthDate )
                      ).getFullYear() - 1970
                    : null,
                citizenship: profile.countryOfCitizenship || null,
                state: profile.state || null,
                city: profile.city || null,
                industries: [].concat( profile.industries || [] ),
                source: ( profile.source || '' ).trim().split( ', ' )
            };

            fs.writeFileSync(
                path + 'info',
                JSON.stringify( info, null, 2 ),
                { flag: 'w' }
            );

            fs.writeFileSync(
                path + 'bio',
                JSON.stringify( [].concat( profile.bios || [] ), null, 2 ),
                { flag: 'w' }
            );

            /**
             * financial assets
             */

            fs.writeFileSync(
                path + 'assets',
                JSON.stringify( [].concat( profile.financialAssets || [] ), null, 2 ),
                { flag: 'w' }
            );

            /**
             * net worth
             */

            let networth = Number( parseFloat( profile.finalWorth || 0 ).toFixed( 3 ) );

            let latest = null,
                change = null;

            if( fs.existsSync( path + 'networth' ) ) {

                latest = JSON.parse( fs.readFileSync( path + 'networth' ) );

                if( latest.value && networth != latest.value ) {

                    let cng = networth - latest.value;

                    change = {
                        value: Number( cng.toFixed( 3 ) ),
                        pct: Number( ( cng / networth * 100 ).toFixed( 3 ) ),
                        date: ts
                    };

                }

            }

            fs.writeFileSync(
                path + 'networth',
                JSON.stringify( {
                    date: ts,
                    value: networth,
                    change: change,
                    private: parseFloat( profile.privateAssetsWorth || 0 ),
                    archived: parseFloat( profile.archivedWorth || 0 )
                }, null, 2 ),
                { flag: 'w' }
            );

            /**
             * rank and list data
             * requires net worth > $1B
             */

            if( profile.rank && networth >= 1000 ) {

                fs.writeFileSync(
                    path + 'rank',
                    JSON.stringify( {
                        rtb: {
                            date: ts,
                            rank: profile.rank
                        }
                    } || null, null, 2 ),
                    { flag: 'w' }
                );

                /**
                 * add list entry
                 */

                list.push( {
                    rank: profile.rank,
                    uri: uri,
                    name: info.name,
                    gender: info.gender,
                    age: info.age,
                    country: info.citizenship,
                    industries: info.industries,
                    source: info.source,
                    networth: networth,
                    change: change
                } );

                /**
                 * stats
                 */

                stats.total += networth;
                stats.count++;

                if( info.gender == 'f' ) {

                    stats.woman++;

                }

            }

            /**
             * extended stats
             */

            let cng_pct = change != null ? change.pct : 0;

            if( info.industries && info.industries.length ) {

                info.industries.forEach( ( industry ) => {

                    if( !( industry in stats.industry ) ) {

                        stats.industry[ industry ] = {
                            count: 0,
                            total: 0,
                            value: 0
                        };

                    }

                    stats.industry[ industry ].count++;

                    stats.industry[ industry ].total += networth;
                    stats.industry[ industry ].value += cng_pct;

                } );

            }

            if( info.citizenship ) {

                if( !( info.citizenship in stats.country ) ) {

                    stats.country[ info.citizenship ] = {
                        count: 0,
                        total: 0,
                        value: 0
                    };

                }

                stats.country[ info.citizenship ].count++;

                stats.country[ info.citizenship ].total += networth;
                stats.country[ info.citizenship ].value += cng_pct;

            }

            /**
             * daily movers
             */

            if( change != null ) {

                movers.value[ uri ] = change.value;
                movers.pct[ uri ] = change.pct;

            }

            /**
             * append history
             */

            if( latest == null || latest.date != ts ) {

                fs.appendFileSync(
                    path + 'history',
                    ts + ' ' + ( profile.rank || '' ) + ' ' + networth + '\r\n',
                    { flag: 'a' }
                );

            }

        } );

        /**
         * daily (rtb) list
         */

        if( list && list.length ) {

            stream = JSON.stringify( {
                date: today,
                total: Number( stats.total.toFixed( 3 ) ),
                count: stats.count,
                woman: stats.woman,
                list: list
            }, null, 2 );

            fs.writeFileSync(
                dir + 'list/rtb/' + today,
                stream, { flag: 'w' }
            );

            fs.writeFileSync(
                dir + 'list/rtb/latest',
                stream, { flag: 'w' }
            );

        }

        /**
         * stats
         */

        fs.appendFileSync(
            dir + 'stats/total',
            today + ' ' + stats.total.toFixed( 3 ) + '\r\n',
            { flag: 'a' }
        );

        fs.appendFileSync(
            dir + 'stats/count',
            today + ' ' + stats.count + '\r\n',
            { flag: 'a' }
        );

        fs.appendFileSync(
            dir + 'stats/woman',
            today + ' ' + stats.woman + '\r\n',
            { flag: 'a' }
        );

        for( const [ key, value ] of Object.entries( stats ) ) {

            if( typeof value == 'object' ) {

                for( const [ k, v ] of Object.entries( value ) ) {

                    fs.appendFileSync(
                        dir + 'stats/' + key + '/' + ( k
                            .toLowerCase()
                            .replace( /[^a-z0-9-]/g, '-' )
                            .replace( /-{1,}/g, '-' )
                            .trim()
                        ),
                        today + ' ' + v.count + ' ' + v.total.toFixed( 3 ) + ' ' + (
                            v.value / v.count
                        ).toFixed( 3 ) + '\r\n',
                        { flag: 'a' }
                    );

                }

            }

        }

        /**
         * daily movers
         */

        for( const [ type, entries ] of Object.entries( movers ) ) {

            if( Object.keys( entries ).length ) {

                /**
                 * winners
                 */

                stream = JSON.stringify(
                    Object.entries( entries ).filter(
                        ( [ ,a ] ) => a > 0
                    ).sort(
                        ( [ ,a ], [ ,b ] ) => b - a
                    ).slice( 0, 10 ),
                    null, 2
                );

                fs.writeFileSync(
                    dir + 'movers/' + type + '/winner/' + today,
                    stream, { flag: 'w' }
                );

                fs.writeFileSync(
                    dir + 'movers/' + type + '/winner/latest',
                    stream, { flag: 'w' }
                );

                /**
                 * losers
                 */

                stream = JSON.stringify(
                    Object.entries( entries ).filter(
                        ( [ ,a ] ) => a < 0
                    ).sort(
                        ( [ ,a ], [ ,b ] ) => a - b
                    ).slice( 0, 10 ),
                    null, 2
                );

                fs.writeFileSync(
                    dir + 'movers/' + type + '/loser/' + today,
                    stream, { flag: 'w' }
                );

                fs.writeFileSync(
                    dir + 'movers/' + type + '/loser/latest',
                    stream, { flag: 'w' }
                );

            }

        }

    }

    /**
     * create profiles list
     */

    fs.readdir( dir + 'profile/', ( err, files ) => {

        let list = [];

        files.forEach( ( file ) => {

            if( fs.lstatSync( dir + 'profile/' + file ).isDirectory() ) {

                list.push( file );

            }

        } );

        fs.writeFileSync(
            dir + 'profile/list',
            JSON.stringify( list, null, 2 ),
            { flag: 'w' }
        );

    } );

    /**
     * updated timestamp
     */

    fs.writeFileSync(
        dir + 'updated',
        ( new Date() ).toISOString(),
        { flag: 'w' }
    );

}

run();