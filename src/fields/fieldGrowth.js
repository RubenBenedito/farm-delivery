// Atualiza o estado de crescimento do campo
export function updateFieldGrowth(field, delta) {
    if (field.state === "growing") {
        field.timeLeft -= delta;

        if (field.timeLeft <= 0) {
            field.state = "ready";
            field.timeLeft = 0;
        }
    }
}
