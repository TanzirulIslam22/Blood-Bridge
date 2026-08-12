import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

const SURVEY_QUESTION_KEYS = [
  'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'
];

const calculateBMI = (heightCm, weightKg) => {
  if (!heightCm || !weightKg || heightCm <= 0 || weightKg <= 0) return null;
  const heightM = heightCm / 100;
  return weightKg / (heightM * heightM);
};

const feetInchesToCm = (feet, inches) => {
  if (!feet) return null;
  return (parseFloat(feet) * 30.48) + (parseFloat(inches || 0) * 2.54);
};

const lbToKg = (lb) => lb * 0.453592;

const HealthCheck = () => {
  const { t, lang } = useLanguage();
  const bnFont = lang === 'bn' ? { fontFamily: "'Noto Sans Bengali', 'DM Sans', sans-serif" } : {};
  const [bmiInputs, setBmiInputs] = useState({ height: '', weight: '', feet: '', inches: '' });
  const [units, setUnits] = useState({ height: 'cm', weight: 'kg' });
  const [survey, setSurvey] = useState({});

  const SURVEY_QUESTIONS = SURVEY_QUESTION_KEYS.map((key, i) => ({
    id: key,
    question: t(`health.survey.${key}`),
    rule: i < 3 ? (key === 'q1' ? 'age' : key === 'q2' ? 'weight' : 'lastDonation') : 'no'
  }));

  const heightCm = units.height === 'ft' ? feetInchesToCm(bmiInputs.feet, bmiInputs.inches) : parseFloat(bmiInputs.height);
  const weightKg = units.weight === 'lb' ? lbToKg(parseFloat(bmiInputs.weight)) : parseFloat(bmiInputs.weight);

  const bmi = calculateBMI(heightCm, weightKg);
  const bmiCategory = bmi
    ? bmi < 18.5
      ? { label: t('health.bmi.underweight'), color: 'text-blue-400', note: t('health.bmi.underweightNote') }
      : bmi < 25
        ? { label: t('health.bmi.normal'), color: 'text-green-400', note: t('health.bmi.normalNote') }
        : bmi < 30
          ? { label: t('health.bmi.overweight'), color: 'text-yellow-400', note: t('health.bmi.overweightNote') }
          : { label: t('health.bmi.obese'), color: 'text-red-400', note: t('health.bmi.obeseNote') }
    : null;

  const answeredCount = Object.keys(survey).length;

  const handleSurvey = (id, value) => {
    setSurvey(prev => ({ ...prev, [id]: value }));
  };

  const eligibility = () => {
    if (answeredCount < SURVEY_QUESTIONS.length) return null;

    const checks = SURVEY_QUESTIONS.map(q => {
      const answer = survey[q.id];
      const pass = q.rule === 'no' ? answer === 'no' : answer === 'yes';
      return { question: q.question, pass, answer };
    });

    const passed = checks.filter(c => c.pass).length;
    const score = Math.round((passed / checks.length) * 100);
    const eligible = passed === checks.length;

    return { eligible, score, checks };
  };

  const result = eligibility();

  return (
    <div className="py-20 px-6 md:px-12" style={{ background: 'linear-gradient(135deg, #0A0505 0%, #150A0A 40%, #1a0808 100%)' }}>
      <div className="max-w-4xl mx-auto" style={bnFont}>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="w-6 h-px bg-[#D62828]"></div>
          <span className="text-xs font-semibold tracking-[3px] uppercase text-[#D62828]">{t('health.label')}</span>
        </div>
        <h1 className="text-[#F5E6E0] mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(40px, 5vw, 64px)', letterSpacing: '2px' }}>
          {t('health.title1')} <em className="not-italic text-[#B09090]" style={{ fontFamily: lang === 'bn' ? "'Noto Sans Bengali', sans-serif" : "'DM Serif Display', serif" }}>{t('health.title2')}</em>
        </h1>
        <p className="text-[#B09090] max-w-2xl mb-10">{t('health.subtitle')}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] p-6">
            <h2 className="text-[#F5E6E0] text-lg font-bold mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>{t('health.bmiCalculator')}</h2>
            <p className="text-xs text-[#B09090] mb-5">{t('health.bmiFormula')}</p>

            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium tracking-[1.5px] uppercase text-[#B09090]">{t('health.height')}</label>
                  <div className="flex rounded overflow-hidden border border-[rgba(255,255,255,0.1)]">
                    <button
                      onClick={() => { setUnits(prev => ({ ...prev, height: 'cm' })); setBmiInputs(prev => ({ ...prev, feet: '', inches: '' })); }}
                      className={`px-3 py-1 text-xs font-semibold transition-colors ${units.height === 'cm' ? 'bg-[#D62828] text-white' : 'text-[#B09090] hover:text-[#F5E6E0]'}`}
                    >
                      cm
                    </button>
                    <button
                      onClick={() => { setUnits(prev => ({ ...prev, height: 'ft' })); setBmiInputs(prev => ({ ...prev, height: '' })); }}
                      className={`px-3 py-1 text-xs font-semibold transition-colors ${units.height === 'ft' ? 'bg-[#D62828] text-white' : 'text-[#B09090] hover:text-[#F5E6E0]'}`}
                    >
                      ft/in
                    </button>
                  </div>
                </div>
                {units.height === 'cm' ? (
                  <input
                    type="number"
                    value={bmiInputs.height}
                    onChange={(e) => setBmiInputs(prev => ({ ...prev, height: e.target.value }))}
                    placeholder="e.g. 170"
                    className="w-full px-4 py-3 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828]"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      value={bmiInputs.feet}
                      onChange={(e) => setBmiInputs(prev => ({ ...prev, feet: e.target.value }))}
                      placeholder={t('health.feetPlaceholder')}
                      className="w-full px-4 py-3 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828]"
                    />
                    <input
                      type="number"
                      value={bmiInputs.inches}
                      onChange={(e) => setBmiInputs(prev => ({ ...prev, inches: e.target.value }))}
                      placeholder={t('health.inchesPlaceholder')}
                      className="w-full px-4 py-3 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828]"
                    />
                  </div>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-medium tracking-[1.5px] uppercase text-[#B09090]">{t('health.weight')}</label>
                  <div className="flex rounded overflow-hidden border border-[rgba(255,255,255,0.1)]">
                    <button
                      onClick={() => setUnits(prev => ({ ...prev, weight: 'kg' }))}
                      className={`px-3 py-1 text-xs font-semibold transition-colors ${units.weight === 'kg' ? 'bg-[#D62828] text-white' : 'text-[#B09090] hover:text-[#F5E6E0]'}`}
                    >
                      kg
                    </button>
                    <button
                      onClick={() => setUnits(prev => ({ ...prev, weight: 'lb' }))}
                      className={`px-3 py-1 text-xs font-semibold transition-colors ${units.weight === 'lb' ? 'bg-[#D62828] text-white' : 'text-[#B09090] hover:text-[#F5E6E0]'}`}
                    >
                      lb
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  value={bmiInputs.weight}
                  onChange={(e) => setBmiInputs(prev => ({ ...prev, weight: e.target.value }))}
                  placeholder={units.weight === 'kg' ? 'e.g. 65' : 'e.g. 143'}
                  className="w-full px-4 py-3 bg-[#150A0A] border border-[rgba(255,255,255,0.08)] text-[#F5E6E0] placeholder-[rgba(176,144,144,0.4)] focus:outline-none focus:border-[#D62828]"
                />
              </div>

              {bmi && bmiCategory && (
                <div className="mt-5 p-4 bg-[#150A0A] border border-[rgba(255,255,255,0.06)]">
                  <p className="text-sm text-[#B09090]">{t('health.yourBMI')}</p>
                  <p className={`text-4xl font-bold mt-1 ${bmiCategory.color}`}>{bmi.toFixed(1)}</p>
                  <p className={`text-sm font-semibold mt-1 ${bmiCategory.color}`}>{bmiCategory.label}</p>
                  <p className="text-xs text-[#B09090] mt-2">{bmiCategory.note}</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#1E0E0E] border border-[rgba(255,255,255,0.05)] p-6">
            <h2 className="text-[#F5E6E0] text-lg font-bold mb-1" style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>{t('health.surveyTitle')}</h2>
            <p className="text-xs text-[#B09090] mb-5">{t('health.surveyHint')}</p>

            <div className="space-y-3">
              {SURVEY_QUESTIONS.map((q, i) => (
                <div key={q.id} className="flex items-start justify-between gap-3 text-sm">
                  <p className="text-[#F5E6E0] flex-1">
                    <span className="text-[#D62828] mr-1.5 font-semibold">{i + 1}.</span>
                    {q.question}
                  </p>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleSurvey(q.id, 'yes')}
                      className={`px-2.5 py-1 text-xs rounded border transition-colors ${survey[q.id] === 'yes' ? 'bg-[rgba(214,40,40,0.2)] border-[#D62828] text-[#D62828]' : 'border-[rgba(255,255,255,0.1)] text-[#B09090] hover:text-[#F5E6E0]'}`}
                    >
                      {t('health.yes')}
                    </button>
                    <button
                      onClick={() => handleSurvey(q.id, 'no')}
                      className={`px-2.5 py-1 text-xs rounded border transition-colors ${survey[q.id] === 'no' ? 'bg-[rgba(214,40,40,0.2)] border-[#D62828] text-[#D62828]' : 'border-[rgba(255,255,255,0.1)] text-[#B09090] hover:text-[#F5E6E0]'}`}
                    >
                      {t('health.no')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {result && (
              <div className={`mt-5 p-4 border ${result.eligible ? 'border-[rgba(34,197,94,0.4)] bg-[rgba(34,197,94,0.05)]' : 'border-[rgba(214,40,40,0.4)] bg-[rgba(214,40,40,0.05)]'}`}>
                <p className={`text-2xl font-bold ${result.eligible ? 'text-green-400' : 'text-[#D62828]'}`}>
                  {result.eligible ? `${t('health.eligible')} ✓` : t('health.notEligible')}
                </p>
                <div className="flex items-center gap-3 mt-3">
                  <div className="flex-1 h-2 bg-[#150A0A] rounded overflow-hidden">
                    <div
                      className={`h-full ${result.eligible ? 'bg-green-400' : 'bg-[#D62828]'}`}
                      style={{ width: `${result.score}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-[#F5E6E0]">{result.score}%</span>
                </div>
                <p className="text-xs text-[#B09090] mt-3">{result.eligible ? t('health.eligibleMsg') : t('health.notEligibleMsg')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthCheck;
