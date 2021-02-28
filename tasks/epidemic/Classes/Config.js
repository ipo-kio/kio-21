export class Config
{
    static _level;
    static _dayCount;
    static _manCount;
    static _startYCount;
    static _toRedDays = 14;
    static _toBlueDays = 60; //28;
    static _toGreenDays = 0;
    static _stukByDayCount = 1;
    static _maskZ = 0.5; // Маски - изменяют количество заражений в день и изменяют ЕЕ за день. 
    static _maskEE = 0.8;
    static _karEE = 0.8; // Карантин - изменяет количество заражений в день путем исключения Красных (R) из этого процесса и изменяет ЕЕ за день.
    static  _bolnicaCount = 100; //-- количество мест в больнице
    static _zarazKoef = 0.01;
    static _kT = 1;

    static init(level)
    {
        Config._level = level;

    

        if(level == 0)
        {
            Config._dayCount = 100;
            Config._manCount = 100;
            Config._startYCount = 1;
            Config._bolnicaMax = 100;
        }
        else if(level == 1)
        {
            Config._dayCount = 100;
            Config._manCount = 100;
            Config._startYCount = 1;
            Config._bolnicaMax = 100;
        }
        else if(level == 2)
        {
            Config._dayCount = 100;
            Config._manCount = 100;
            Config._startYCount = 1;
            Config._bolnicaMax = 20;
        }
    
    }
}