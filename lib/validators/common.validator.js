export default class CommonValidator {
    isNotPositive(number) {
        return Math.sign(number) !== 1;
    }
}
