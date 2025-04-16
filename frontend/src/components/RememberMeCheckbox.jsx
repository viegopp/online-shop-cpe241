const RememberMeCheckbox = ({ checked, onChange }) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-slate-600 border-slate-300 rounded focus:ring-slate-500"
      />
      <span className="text-sm text-slate-600">Remember me</span>
    </label>
  );
};

export default RememberMeCheckbox;
