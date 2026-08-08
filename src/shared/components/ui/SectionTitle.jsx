import { MotionDiv } from "../../hooks/useMotion";
const SectionTitle = ({ badge, title, description, className = "" }) => <MotionDiv
  initial={{ opacity: 0, y: 30 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  className={`text-center mb-12 ${className}`}
>
    {badge}
    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">
      {title}
    </h2>
    {description && <p className="text-slate-500 max-w-xl mx-auto font-medium">{description}</p>}
  </MotionDiv>;
export {
  SectionTitle
};
