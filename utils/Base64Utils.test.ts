import Base64Utils from './Base64Utils';

describe('Base64Utils', () => {
    describe('encodeStringToBase64', () => {
        it('Converts string to Base64', () => {
            expect(Base64Utils.encodeStringToBase64('test1234')).toEqual(
                'dGVzdDEyMzQ='
            );
            expect(Base64Utils.encodeStringToBase64('✓')).toEqual('4pyT');
            expect(Base64Utils.encodeStringToBase64('™“')).toEqual('4oSi4oCc');
        });
    });

    describe('decodeBase64ToString', () => {
        it('Converts Base64 to utf8 string', () => {
            expect(Base64Utils.decodeBase64ToString('dGVzdDEyMzQ=')).toEqual(
                'test1234'
            );
            expect(Base64Utils.decodeBase64ToString('4pyT')).toEqual('✓');
            expect(Base64Utils.decodeBase64ToString('4oSi4oCc')).toEqual('™“');
        });
    });

    describe('utf8ToHexString', () => {
        it('Converts utf8 string to hexadecimal string', () => {
            expect(
                Base64Utils.utf8ToHexString('Test string with punctuation.')
            ).toEqual(
                '5465737420737472696e6720776974682070756e6374756174696f6e2e'
            );
            expect(Base64Utils.utf8ToHexString('1234567890')).toEqual(
                '31323334353637383930'
            );
            expect(Base64Utils.utf8ToHexString('!@#$%^&*')).toEqual(
                '21402324255e262a'
            );
            expect(Base64Utils.utf8ToHexString('áéíÓÚ àèìÒÙ âêîÔÛ')).toEqual(
                'c3a1c3a9c3adc393c39a20c3a0c3a8c3acc392c39920c3a2c3aac3aec394c39b'
            );
        });
    });

    describe('base64ToHex', () => {
        it('Converts base64 string to hexadecimal string', () => {
            expect(
                Base64Utils.base64ToHex('VGhpcyBpcyB0aGUgZmlyc3QgdGVzdA==')
            ).toEqual('54686973206973207468652066697273742074657374');
            expect(Base64Utils.base64ToHex('RW5kIHRoZSBGZWQ=')).toEqual(
                '456e642074686520466564'
            );
            expect(
                Base64Utils.base64ToHex(
                    'RGVjb2RpbmcgdGhpcyBCYXNlNjQ/IFF1aXRlIHNwb29reS4='
                )
            ).toEqual(
                '4465636f64696e672074686973204261736536343f2051756974652073706f6f6b792e'
            );
            expect(Base64Utils.base64ToHex('WkVVUw==')).toEqual('5a455553');
            expect(
                Base64Utils.base64ToHex(
                    'AoJXmNvi6wDqzNnB9rrptOrK1T+20beEtJ/HCtFt4gWE'
                )
            ).toEqual(
                '02825798dbe2eb00eaccd9c1f6bae9b4eacad53fb6d1b784b49fc70ad16de20584'
            );
        });
    });

    describe('hexToBase64', () => {
        it('Converts hexadecimal string to base64 string', () => {
            expect(
                Base64Utils.hexToBase64(
                    '54686973206973207468652066697273742074657374'
                )
            ).toEqual('VGhpcyBpcyB0aGUgZmlyc3QgdGVzdA==');
            expect(Base64Utils.hexToBase64('456e642074686520466564')).toEqual(
                'RW5kIHRoZSBGZWQ='
            );
            expect(
                Base64Utils.hexToBase64(
                    '4465636f64696e672074686973204261736536343f2051756974652073706f6f6b792e'
                )
            ).toEqual('RGVjb2RpbmcgdGhpcyBCYXNlNjQ/IFF1aXRlIHNwb29reS4=');
            expect(Base64Utils.hexToBase64('5a455553')).toEqual('WkVVUw==');
            expect(
                Base64Utils.hexToBase64(
                    '02825798dbe2eb00eaccd9c1f6bae9b4eacad53fb6d1b784b49fc70ad16de20584'
                )
            ).toEqual('AoJXmNvi6wDqzNnB9rrptOrK1T+20beEtJ/HCtFt4gWE');
        });
    });

    describe('base64UrlToHex', () => {
        it('converts base64-encoded macaroon to hex', () => {
            const macaroonBase64 =
                'AgEDbG5kAvgBAwoQhfBE_aL-FIv4HVMZvdyJpBIBMBoWCgdhZGRyZXNzEgRyZWFkEgV3cml0ZRoTCgRpbmZvEgRyZWFkEgV3cml0ZRoXCghpbnZvaWNlcxIEcmVhZBIFd3JpdGUaIQoIbWFjYXJvb24SCGdlbmVyYXRlEgRyZWFkEgV3cml0ZRoWCgdtZXNzYWdlEgRyZWFkEgV3cml0ZRoXCghvZmZjaGFpbhIEcmVhZBIFd3JpdGUaFgoHb25jaGFpbhIEcmVhZBIFd3JpdGUaFAoFcGVlcnMSBHJlYWQSBXdyaXRlGhgKBnNpZ25lchIIZ2VuZXJhdGUSBHJlYWQAAAYgZ7y0NmtAbS6hq1Pk-2Yfa17TtkbqMYmzAXfdHo54MoE';

            const macaroonHex = Base64Utils.base64UrlToHex(macaroonBase64);

            expect(macaroonHex).toBe(
                '0201036c6e6402f801030a1085f044fda2fe148bf81d5319bddc89a41201301a160a0761646472657373120472656164120577726974651a130a04696e666f120472656164120577726974651a170a08696e766f69636573120472656164120577726974651a210a086d616361726f6f6e120867656e6572617465120472656164120577726974651a160a076d657373616765120472656164120577726974651a170a086f6666636861696e120472656164120577726974651a160a076f6e636861696e120472656164120577726974651a140a057065657273120472656164120577726974651a180a067369676e6572120867656e65726174651204726561640000062067bcb4366b406d2ea1ab53e4fb661f6b5ed3b646ea3189b30177dd1e8e783281'
            );
        });
    });
});
